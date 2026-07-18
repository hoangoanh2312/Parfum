import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  adminApi,
  apiMessage,
  formatVnd,
  formatDate,
  ORDER_STATUS_LABEL,
  type Stats,
} from "../../lib/adminApi";
import { toast } from "../../store/toast.store";
import {
  Card,
  LoadingState,
  OrderStatusBadge,
  PageHeader,
} from "../../components/admin/ui";

function StatCard({
  label,
  value,
  hint,
  to,
}: {
  label: string;
  value: string | number;
  hint?: string;
  to?: string;
}) {
  const body = (
    <Card className="p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <h2 className="mt-2 text-3xl font-bold text-gray-900">{value}</h2>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </Card>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setStats(await adminApi.get<Stats>("/stats"));
      } catch (e) {
        toast.error(apiMessage(e, "Không tải được thống kê"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingState />;
  if (!stats) return null;

  return (
    <div>
      <PageHeader
        title="Tổng quan"
        subtitle="Bảng điều khiển quản trị toàn bộ nghiệp vụ cửa hàng"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Doanh thu"
          value={formatVnd(stats.revenue)}
          hint="Đơn đã thanh toán / giao / hoàn tất"
        />
        <StatCard label="Đơn hàng" value={stats.orderCount} to="/admin/orders" />
        <StatCard
          label="Sản phẩm"
          value={stats.productCount}
          hint={`${stats.activeProductCount} đang bán`}
          to="/admin/products"
        />
        <StatCard label="Người dùng" value={stats.userCount} hint={`${stats.adminCount} admin`} to="/admin/users" />
        <StatCard label="Biến thể" value={stats.variantCount} to="/admin/variants" />
        <StatCard label="Thương hiệu" value={stats.brandCount} to="/admin/brands" />
        <StatCard label="Danh mục" value={stats.categoryCount} to="/admin/categories" />
        <StatCard
          label="Đánh giá chờ duyệt"
          value={stats.pendingReviews}
          to="/admin/reviews"
        />
      </div>

      {stats.lowStockCount > 0 && (
        <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          ⚠️ Có <b>{stats.lowStockCount}</b> biến thể sắp hết hàng (tồn ≤ 5).{" "}
          <Link to="/admin/variants" className="font-semibold underline">
            Kiểm tra tồn kho
          </Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Đơn theo trạng thái</h3>
          <ul className="space-y-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <li key={status} className="flex items-center justify-between text-sm">
                <OrderStatusBadge status={status} />
                <span className="font-semibold text-gray-900">{count}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400">Chưa có đơn hàng nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                    <th className="pb-2">Mã</th>
                    <th className="pb-2">Khách</th>
                    <th className="pb-2">SL</th>
                    <th className="pb-2">Tổng</th>
                    <th className="pb-2">Trạng thái</th>
                    <th className="pb-2">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-gray-50">
                      <td className="py-2 font-mono text-xs">
                        <Link to="/admin/orders" className="text-gray-900 hover:underline">
                          #{o.id.slice(-6).toUpperCase()}
                        </Link>
                      </td>
                      <td className="py-2">{o.customer}</td>
                      <td className="py-2">{o.itemCount}</td>
                      <td className="py-2">{formatVnd(o.total)}</td>
                      <td className="py-2">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="py-2 text-xs text-gray-500">{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Mẹo: các nhãn trạng thái — {Object.values(ORDER_STATUS_LABEL).join(", ")}.
      </p>
    </div>
  );
}
