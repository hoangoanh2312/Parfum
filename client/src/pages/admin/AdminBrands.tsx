import AdminResourcePage from "../../components/admin/AdminResourcePage";

export default function AdminBrands() {
  return (
    <AdminResourcePage
      resource="brands"
      title="Quản lý thương hiệu"
      singularLabel="thương hiệu"
      description="Thêm, chỉnh sửa và quản lý các thương hiệu sản phẩm."
      deleteConflictMessage="Không thể xóa thương hiệu đang được sử dụng"
    />
  );
}
