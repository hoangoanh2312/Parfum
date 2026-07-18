import { useEffect, useState } from "react";
import {
  adminApi,
  apiMessage,
  type AdminBrand,
} from "../../lib/adminApi";
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

export default function AdminBrands() {
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBrand | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminBrand | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setBrands(await adminApi.get<AdminBrand[]>("/brands"));
    } catch (e) {
      toast.error(apiMessage(e, "Không tải được thương hiệu"));
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
  function openEdit(b: AdminBrand) {
    setEditing(b);
    setName(b.name);
    setModalOpen(true);
  }

  async function save() {
    if (!name.trim()) return toast.error("Nhập tên thương hiệu");
    try {
      setSaving(true);
      if (editing) {
        await adminApi.put(`/brands/${editing.id}`, { name: name.trim() });
        toast.success("Đã cập nhật");
      } else {
        await adminApi.post("/brands", { name: name.trim() });
        toast.success("Đã thêm thương hiệu");
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
      await adminApi.del(`/brands/${deleteTarget.id}`);
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
        title="Quản lý thương hiệu"
        subtitle="Thêm, sửa, xoá thương hiệu sản phẩm"
        actions={<Button onClick={openCreate}>+ Thêm thương hiệu</Button>}
      />

      <Card>
        {loading ? (
          <LoadingState />
        ) : brands.length === 0 ? (
          <EmptyState message="Chưa có thương hiệu nào." />
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
              {brands.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{b.name}</td>
                  <td className="p-4">
                    <Badge>{b.productCount}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => openEdit(b)}>
                        Sửa
                      </Button>
                      <Button variant="danger" onClick={() => setDeleteTarget(b)}>
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
        title={editing ? "Sửa thương hiệu" : "Thêm thương hiệu"}
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
        <Field label="Tên thương hiệu">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
        </Field>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá thương hiệu"
        message={`Xoá "${deleteTarget?.name}"?`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}
