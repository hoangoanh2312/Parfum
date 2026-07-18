import AdminResourcePage from "../../components/admin/AdminResourcePage";

export default function AdminCategories() {
  return (
    <AdminResourcePage
      resource="categories"
      title="Quản lý danh mục"
      singularLabel="danh mục"
      description="Thêm, chỉnh sửa và quản lý các danh mục sản phẩm."
      deleteConflictMessage="Không thể xóa danh mục đang được sử dụng"
    />
  );
}
