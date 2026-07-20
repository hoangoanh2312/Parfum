import axios from "axios";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  createAdminResource,
  deleteAdminResource,
  getAdminResources,
  updateAdminResource,
  type AdminResourcePath,
} from "../../lib/admin-resource.api";
import { toast } from "../../store/toast.store";
import type {
  AdminResource,
  AdminResourceSort,
  Pagination,
} from "../../types/admin-resource";

type Props = {
  resource: AdminResourcePath;
  title: string;
  singularLabel: string;
  description: string;
  deleteConflictMessage: string;
};

const EMPTY_PAGINATION: Pagination = {
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
};

function errorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
}

export default function AdminResourcePage({
  resource,
  title,
  singularLabel,
  description,
  deleteConflictMessage,
}: Props) {
  const [items, setItems] = useState<AdminResource[]>([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<AdminResourceSort>("newest");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [editing, setEditing] = useState<AdminResource | null | undefined>();
  const [name, setName] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<AdminResource | null>(null);
  const [deletePending, setDeletePending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const result = await getAdminResources(resource, { page, limit: 10, search, sort });
      if (result.pagination.totalPages > 0 && page > result.pagination.totalPages) {
        setPage(result.pagination.totalPages);
        return;
      }
      setItems(result.items);
      setPagination(result.pagination);
    } catch (error) {
      setLoadError(errorMessage(error, `Không thể tải danh sách ${title.toLowerCase()}`));
    } finally {
      setLoading(false);
    }
  }, [page, reloadKey, resource, search, sort, title]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  function openForm(item?: AdminResource) {
    setEditing(item ?? null);
    setName(item?.name ?? "");
    setFormError("");
  }

  function closeForm() {
    if (!submitting) setEditing(undefined);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim().replace(/\s+/g, " ");
    if (!trimmedName) {
      setFormError(`Vui lòng nhập tên ${singularLabel}`);
      return;
    }
    if (trimmedName.length < 2 || Array.from(trimmedName).length > 100) {
      setFormError("Tên phải có độ dài từ 2 đến 100 ký tự");
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      const response = editing
        ? await updateAdminResource(resource, editing._id, trimmedName)
        : await createAdminResource(resource, trimmedName);
      toast.success(response.message || `${editing ? "Đã cập nhật" : "Đã thêm"} ${singularLabel}`);
      setEditing(undefined);
      setPage(1);
      setReloadKey((key) => key + 1);
    } catch (error) {
      setFormError(errorMessage(error, `Không thể ${editing ? "cập nhật" : "thêm"} ${singularLabel}`));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleting || deletePending) return;
    setDeletePending(true);
    try {
      const response = await deleteAdminResource(resource, deleting._id);
      toast.success(response.message || `Đã xóa ${singularLabel}`);
      setDeleting(null);
      setReloadKey((key) => key + 1);
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.status === 409
          ? deleteConflictMessage
          : errorMessage(error, `Không thể xóa ${singularLabel}`);
      toast.error(message);
    } finally {
      setDeletePending(false);
    }
  }

  const firstItem = pagination.totalItems ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const lastItem = Math.min(pagination.page * pagination.limit, pagination.totalItems);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">{description}</p>
        </div>
        <button onClick={() => openForm()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">
          <Plus size={18} /> Thêm {singularLabel}
        </button>
      </header>

      <section className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Tìm kiếm</span>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder={`Tìm theo tên ${singularLabel}...`} className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-200" />
          </label>
          <select value={sort} onChange={(event) => { setSort(event.target.value as AdminResourceSort); setPage(1); }} className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-200" aria-label="Sắp xếp">
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="name_asc">Tên A-Z</option>
            <option value="name_desc">Tên Z-A</option>
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-2 text-gray-500"><LoaderCircle className="animate-spin" size={22} /> Đang tải dữ liệu...</div>
        ) : loadError ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <AlertCircle className="text-red-500" size={36} />
            <p className="mt-3 font-medium text-gray-900">{loadError}</p>
            <button onClick={() => setReloadKey((key) => key + 1)} className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">Thử lại</button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <Search className="text-gray-300" size={40} />
            <p className="mt-3 font-semibold text-gray-900">{search ? "Không tìm thấy kết quả phù hợp" : `Chưa có ${singularLabel} nào`}</p>
            <p className="mt-1 text-sm text-gray-500">{search ? "Hãy thử một từ khóa khác." : `Thêm ${singularLabel} đầu tiên để bắt đầu quản lý.`}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <article key={item._id} className="flex items-center gap-3 p-4 hover:bg-gray-50 sm:px-6">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-gray-900">{item.name}</h2>
                  {item.createdAt && <p className="mt-1 text-xs text-gray-500">Ngày tạo: {new Date(item.createdAt).toLocaleDateString("vi-VN")}</p>}
                </div>
                <button onClick={() => openForm(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white" aria-label={`Sửa ${item.name}`}><Pencil size={16} /><span className="hidden sm:inline">Sửa</span></button>
                <button onClick={() => setDeleting(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50" aria-label={`Xóa ${item.name}`}><Trash2 size={16} /><span className="hidden sm:inline">Xóa</span></button>
              </article>
            ))}
          </div>
        )}

        {!loading && !loadError && pagination.totalItems > 0 && (
          <footer className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>Hiển thị {firstItem}-{lastItem} trong {pagination.totalItems}</span>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Trang trước"><ChevronLeft size={18} /></button>
              <span className="min-w-20 text-center">Trang {pagination.page}/{Math.max(pagination.totalPages, 1)}</span>
              <button disabled={page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Trang sau"><ChevronRight size={18} /></button>
            </div>
          </footer>
        )}
      </section>

      {editing !== undefined && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="resource-form-title" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between">
              <h2 id="resource-form-title" className="text-xl font-bold text-gray-900">{editing ? "Sửa" : "Thêm"} {singularLabel}</h2>
              <button type="button" onClick={closeForm} disabled={submitting} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-50" aria-label="Đóng"><X size={20} /></button>
            </div>
            <label className="mt-5 block text-sm font-semibold text-gray-700" htmlFor="resource-name">Tên {singularLabel}<span className="text-red-500"> *</span></label>
            <input id="resource-name" autoFocus value={name} onChange={(event) => { setName(event.target.value); setFormError(""); }} disabled={submitting} maxLength={100} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100" aria-invalid={Boolean(formError)} />
            {formError && <p className="mt-2 text-sm text-red-600" role="alert">{formError}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={closeForm} disabled={submitting} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50">Hủy</button>
              <button type="submit" disabled={submitting} className="inline-flex min-w-24 items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60">{submitting && <LoaderCircle className="animate-spin" size={17} />}{submitting ? "Đang lưu" : "Lưu"}</button>
            </div>
          </form>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600"><Trash2 size={21} /></div>
            <h2 id="delete-title" className="mt-4 text-xl font-bold text-gray-900">Xác nhận xóa {singularLabel}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">Bạn có chắc muốn xóa <strong className="break-words text-gray-900">{deleting.name}</strong>? Thao tác này không thể hoàn tác.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleting(null)} disabled={deletePending} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50">Hủy</button>
              <button onClick={() => void handleDelete()} disabled={deletePending} className="inline-flex min-w-24 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">{deletePending && <LoaderCircle className="animate-spin" size={17} />}{deletePending ? "Đang xóa" : "Xóa"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

