import { useEffect, useState } from "react";
import { adminApi, apiMessage, type AdminCategory } from "../../lib/adminApi";
import { toast } from "../../store/toast.store";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Input,
  LoadingState,
  Modal,
  PageHeader,
} from "../../components/admin/ui";

export default function AdminCategories() {
  const [items, setItems] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setItems(await adminApi.get<AdminCategory[]>("/categories"));
    } catch (e) {
      toast.error(apiMessage(e, "Không tải được danh mục"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setName("");
    setModalOpen(true);
  }
  function openEdit(c: AdminCategory) {
    setEditing(c);
    setName(c.name);
    setModalOpen(true);
  }

  async function save() {
    if (!name.trim()) return toast.error("Nhập tên danh mục");
    try {
      setSaving(true);
      if (editing) {
        await adminApi.put(`/categories/${editing.id}`, { name: name.trim() });
        toast.success("Đã cập nhật");
      } else {
        await adminApi.post("/categories", { name: name.trim() });
        toast.success("Đã thêm danh mục");
      }
      setModalOpen(false);
      load();
    } catch (e) {
      toast.error(apiMessage(e, "Lưu thất bại"));
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminApi.del(`/categories/${deleteTarget.id}`);
      toast.success("Đã xoá");
      setDeleteTarget(null);
      load();
    } catch (e) {
      toast.error(apiMessage(e, "Xoá thất bại"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Quản lý danh mục"
        subtitle="Thêm, sửa, xoá danh mục sản phẩm"
        actions={<Button onClick={openCreate}>+ Thêm danh mục</Button>}
      />

      <Card>
        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState message="Chưa có danh mục nào." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                <th className="p-4">Tên</th>
                <th className="p-4">Số sản phẩm</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{c.name}</td>
                  <td className="p-4">
                    <Badge>{c.productCount}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => openEdit(c)}>
                        Sửa
                      </Button>
                      <Button variant="danger" onClick={() => setDeleteTarget(c)}>
                        Xoá
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Sửa danh mục" : "Thêm danh mục"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </>
        }
      >
        <Field label="Tên danh mục">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
        </Field>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá danh mục"
        message={`Xoá "${deleteTarget?.name}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}
