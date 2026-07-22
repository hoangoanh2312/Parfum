import { useEffect, useState } from "react";
import { ExternalLink, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { adminApi, apiMessage, type AdminBrand } from "../../lib/adminApi";
import { toast } from "../../store/toast.store";
import { DEFAULT_BRANDS } from "../brandData";
import ImageUploader from "../../components/admin/ImageUploader";
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
  Textarea,
} from "../../components/admin/ui";

type BrandForm = {
  name: string;
  description: string;
  logo: string;
  heroImage: string;
  country: string;
  website: string;
  foundedYear: string;
  isFeatured: boolean;
};

const EMPTY_FORM: BrandForm = {
  name: "",
  description: "",
  logo: "",
  heroImage: "",
  country: "",
  website: "",
  foundedYear: "",
  isFeatured: false,
};

function toForm(brand: AdminBrand): BrandForm {
  return {
    name: brand.name || "",
    description: brand.description || "",
    logo: brand.logo || "",
    heroImage: brand.heroImage || "",
    country: brand.country || "",
    website: brand.website || "",
    foundedYear: brand.foundedYear ? String(brand.foundedYear) : "",
    isFeatured: Boolean(brand.isFeatured),
  };
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBrand | null>(null);
  const [form, setForm] = useState<BrandForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminBrand | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      setLoading(true);
      await adminApi
        .post("/brands/import-defaults", {
          brands: DEFAULT_BRANDS.map((brand) => ({
            name: brand.name,
            slug: brand.slug,
            description: brand.description,
            image: brand.image,
            logo: brand.image,
            heroImage: brand.image,
            isFeatured: true,
          })),
        })
        .catch((error) => {
          toast.error(apiMessage(error, "Không đồng bộ được thương hiệu cũ"));
        });
      setBrands(await adminApi.get<AdminBrand[]>("/brands"));
    } catch (error) {
      toast.error(apiMessage(error, "Không tải được thương hiệu"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(brand: AdminBrand) {
    setEditing(brand);
    setForm(toForm(brand));
    setModalOpen(true);
  }

  async function save() {
    if (!form.name.trim()) return toast.error("Nhập tên thương hiệu");
    const foundedYear = form.foundedYear ? Number(form.foundedYear) : null;
    if (foundedYear && (foundedYear < 1000 || foundedYear > new Date().getFullYear())) {
      return toast.error("Năm thành lập không hợp lệ");
    }
    const payload = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      country: form.country.trim(),
      website: form.website.trim(),
      foundedYear,
    };
    try {
      setSaving(true);
      if (editing) await adminApi.put(`/brands/${editing.id}`, payload);
      else await adminApi.post("/brands", payload);
      toast.success(editing ? "Đã cập nhật thương hiệu" : "Đã thêm thương hiệu");
      setModalOpen(false);
      await load();
    } catch (error) {
      toast.error(apiMessage(error, "Lưu thương hiệu thất bại"));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminApi.del(`/brands/${deleteTarget.id}`);
      toast.success("Đã xóa thương hiệu");
      setDeleteTarget(null);
      await load();
    } catch (error) {
      toast.error(apiMessage(error, "Xóa thương hiệu thất bại"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Quản lý thương hiệu"
        subtitle="Quản lý hồ sơ, hình ảnh và trạng thái hiển thị của thương hiệu"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Thêm thương hiệu
          </Button>
        }
      />

      <Card className="overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : brands.length === 0 ? (
          <EmptyState message="Chưa có thương hiệu nào." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                  <th className="p-4">Thương hiệu</th>
                  <th className="p-4">Thông tin</th>
                  <th className="p-4">Sản phẩm</th>
                  <th className="p-4">Hiển thị</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id} className="border-b border-gray-50 align-middle hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.name} className="h-12 w-12 border border-gray-100 bg-white object-contain p-1" />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center bg-[#EEEAE4] font-title text-lg text-gray-700">{brand.name.charAt(0)}</div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900">{brand.name}</p>
                          <p className="max-w-56 truncate text-xs text-gray-400">/{brand.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <p>{[brand.country, brand.foundedYear].filter(Boolean).join(" · ") || "Chưa cập nhật"}</p>
                      {brand.website && (
                        <a href={brand.website} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-[#75672F] hover:underline">
                          Website <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                    <td className="p-4"><Badge>{brand.productCount}</Badge></td>
                    <td className="p-4">
                      {brand.isFeatured ? <Badge color="yellow"><Star className="mr-1 inline h-3 w-3" /> Nổi bật</Badge> : <Badge>Thông thường</Badge>}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => openEdit(brand)} title="Sửa thương hiệu"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="danger" onClick={() => setDeleteTarget(brand)} title="Xóa thương hiệu"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Cập nhật thương hiệu" : "Thêm thương hiệu"}
        wide
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Đang lưu..." : "Lưu thương hiệu"}</Button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tên thương hiệu">
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </Field>
          <Field label="Quốc gia">
            <Input value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} placeholder="Pháp, Ý, Anh..." />
          </Field>
          <Field label="Năm thành lập">
            <Input type="number" min="1000" max={new Date().getFullYear()} value={form.foundedYear} onChange={(event) => setForm({ ...form, foundedYear: event.target.value })} />
          </Field>
          <Field label="Website">
            <Input type="url" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} placeholder="https://..." />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Mô tả thương hiệu">
            <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-28" />
          </Field>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Logo">
            <div className="space-y-2">
              <Input value={form.logo} onChange={(event) => setForm({ ...form, logo: event.target.value })} placeholder="URL logo" />
              <ImageUploader multiple={false} folder="brand" label="Chọn logo" onUploaded={(urls) => setForm((current) => ({ ...current, logo: urls[0] || current.logo }))} />
              {form.logo && <img src={form.logo} alt="Xem trước logo" className="h-24 w-full border border-gray-200 bg-white object-contain p-2" />}
            </div>
          </Field>
          <Field label="Ảnh hero">
            <div className="space-y-2">
              <Input value={form.heroImage} onChange={(event) => setForm({ ...form, heroImage: event.target.value })} placeholder="URL ảnh bìa" />
              <ImageUploader multiple={false} folder="brand" label="Chọn ảnh hero" onUploaded={(urls) => setForm((current) => ({ ...current, heroImage: urls[0] || current.heroImage }))} />
              {form.heroImage && <img src={form.heroImage} alt="Xem trước ảnh hero" className="h-24 w-full border border-gray-200 object-cover" />}
            </div>
          </Field>
        </div>

        <label className="mt-5 flex items-center gap-3 border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          <input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} className="h-4 w-4 accent-gray-900" />
          Hiển thị trong nhóm thương hiệu nổi bật
        </label>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa thương hiệu"
        message={`Xóa "${deleteTarget?.name || ""}"? Chỉ có thể xóa thương hiệu không còn sản phẩm.`}
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </div>
  );
}
