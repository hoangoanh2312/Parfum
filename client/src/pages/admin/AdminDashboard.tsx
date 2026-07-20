export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
      <p className="mt-2 text-gray-600">
        Khu vực quản trị dành riêng cho tài khoản admin.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">Sản phẩm</p>
          <h2 className="mt-2 text-3xl font-bold">0</h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">Thương hiệu</p>
          <h2 className="mt-2 text-3xl font-bold">0</h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">Danh mục</p>
          <h2 className="mt-2 text-3xl font-bold">0</h2>
        </div>
      </div>
    </div>
  );
}