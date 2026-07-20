// =============================================================================
//  ADMIN MEDIA — Thu vien anh (Cloudinary) quan ly toan he thong
//  - Xem trang thai cau hinh Cloudinary
//  - Tai anh len (nhieu file)
//  - Xem luoi anh, copy URL, xoa anh
//  - Tai them (phan trang bang next_cursor)
// =============================================================================
import { useEffect, useState } from "react";
import { adminApi, apiMessage } from "../../lib/adminApi";
import { toast } from "../../store/toast.store";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  LoadingState,
  PageHeader,
} from "../../components/admin/ui";
import ImageUploader from "../../components/admin/ImageUploader";

type MediaImage = {
  publicId: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
};
type MediaList = { images: MediaImage[]; nextCursor: string | null; folder: string };
type MediaStatus = { configured: boolean; cloudName: string | null; folder: string };

function formatBytes(n: number): string {
  if (!n) return "—";
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / 1024 / 1024).toFixed(2) + " MB";
}

export default function AdminMedia() {
  const [status, setStatus] = useState<MediaStatus | null>(null);
  const [images, setImages] = useState<MediaImage[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [toDelete, setToDelete] = useState<MediaImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadStatus() {
    try {
      setStatus(await adminApi.get<MediaStatus>("/media/status"));
    } catch {
      /* bo qua */
    }
  }

  async function loadImages(reset = true) {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);
      const res = await adminApi.get<MediaList>("/media", {
        max: 24,
        cursor: reset ? undefined : cursor || undefined,
      });
      setImages((prev) => (reset ? res.images : [...prev, ...res.images]));
      setCursor(res.nextCursor);
    } catch (e) {
      toast.error(apiMessage(e, "Không tải được danh sách ảnh"));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadStatus();
    loadImages(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminApi.post("/media/delete", { publicId: toDelete.publicId });
      setImages((prev) => prev.filter((i) => i.publicId !== toDelete.publicId));
      toast.success("Đã xoá ảnh");
      setToDelete(null);
    } catch (e) {
      toast.error(apiMessage(e, "Xoá ảnh thất bại"));
    } finally {
      setDeleting(false);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard?.writeText(url).then(
      () => toast.success("Đã copy URL ảnh"),
      () => toast.error("Không copy được"),
    );
  }

  return (
    <div>
      <PageHeader
        title="Thư viện ảnh"
        subtitle="Quản lý toàn bộ ảnh hệ thống trên Cloudinary"
        actions={
          status?.configured ? (
            <ImageUploader
              multiple
              label="Tải ảnh lên"
              onUploaded={() => loadImages(true)}
            />
          ) : undefined
        }
      />

      {/* Trang thai cau hinh Cloudinary */}
      {status && !status.configured && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50 p-5">
          <h3 className="font-semibold text-yellow-800">
            ⚠️ Cloudinary chưa được cấu hình
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            Thêm 3 biến sau vào file <code>server/.env</code> rồi khởi động lại server:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-yellow-100 p-3 text-xs text-yellow-900">
{`CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx`}
          </pre>
          <p className="mt-2 text-xs text-yellow-700">
            Lấy thông tin tại dashboard.cloudinary.com → Account Details.
          </p>
        </Card>
      )}

      {status?.configured && (
        <p className="mb-4 text-sm text-gray-500">
          Cloud: <span className="font-medium text-gray-700">{status.cloudName}</span> · Thư mục:{" "}
          <span className="font-medium text-gray-700">{status.folder}/</span>
        </p>
      )}

      {loading ? (
        <LoadingState />
      ) : images.length === 0 ? (
        <EmptyState message="Chưa có ảnh nào. Hãy tải ảnh lên." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {images.map((img) => (
              <Card key={img.publicId} className="group overflow-hidden">
                <div className="aspect-square w-full overflow-hidden bg-gray-100">
                  <img
                    src={img.url}
                    alt={img.publicId}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-2">
                  <p className="truncate text-xs text-gray-500" title={img.publicId}>
                    {img.publicId.replace(status?.folder + "/", "")}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {img.width}×{img.height} · {formatBytes(img.bytes)}
                  </p>
                  <div className="mt-2 flex gap-1">
                    <Button
                      variant="secondary"
                      className="flex-1 px-2 py-1 text-xs"
                      onClick={() => copyUrl(img.url)}
                    >
                      Copy URL
                    </Button>
                    <Button
                      variant="danger"
                      className="px-2 py-1 text-xs"
                      onClick={() => setToDelete(img)}
                    >
                      Xoá
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {cursor && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="secondary"
                disabled={loadingMore}
                onClick={() => loadImages(false)}
              >
                {loadingMore ? "Đang tải..." : "Tải thêm"}
              </Button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Xoá ảnh"
        message="Bạn có chắc muốn xoá ảnh này khỏi Cloudinary? Hành động không thể hoàn tác."
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
