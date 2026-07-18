// =============================================================================
//  IMAGE UPLOADER — nut tai anh len Cloudinary, tra ve mang URL.
//  Dung trong form san pham / bien the va trang Thu vien anh.
// =============================================================================
import { useRef, useState } from "react";
import { api } from "../../lib/api";
import { apiMessage } from "../../lib/adminApi";
import { toast } from "../../store/toast.store";
import { Button } from "./ui";

type Props = {
  onUploaded: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
};

export default function ImageUploader({
  onUploaded,
  multiple = true,
  label = "Tải ảnh lên",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      if (files.length > 1) {
        const fd = new FormData();
        Array.from(files).forEach((f) => fd.append("images", f));
        const { data } = await api.post("/admin/media/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        (data.data as { url: string }[]).forEach((it) => urls.push(it.url));
      } else {
        const fd = new FormData();
        fd.append("image", files[0]);
        const { data } = await api.post("/admin/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        urls.push(data.url || data.data?.url);
      }
      onUploaded(urls.filter(Boolean));
      toast.success(`Đã tải lên ${urls.length} ảnh`);
    } catch (e) {
      toast.error(apiMessage(e, "Tải ảnh thất bại"));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button
        type="button"
        variant="secondary"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? "Đang tải..." : `📤 ${label}`}
      </Button>
    </>
  );
}
