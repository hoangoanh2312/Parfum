export default function AdminBrands() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Quản lý thương hiệu
      </h1>

      <p className="mt-2 text-gray-600">
        Trang này dùng cho module quản lý thương hiệu sản phẩm.
      </p>

      <div className="mt-6 rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">Danh sách thương hiệu</h2>
        <p className="mt-2 text-gray-500">
          Chức năng thêm, sửa, xóa thương hiệu sẽ được làm ở task tiếp theo.
        </p>
      </div>
    </div>
  );
}