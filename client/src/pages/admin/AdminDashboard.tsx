import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  adminApi,
  apiMessage,
  formatVnd,
  formatDate,
  ORDER_STATUS_LABEL,
  ORDER_STATUSES,
  type Stats,
} from "../../lib/adminApi";
import { toast } from "../../store/toast.store";
import { useAuth } from "../../store/auth.store";
import { Card, LoadingState, OrderStatusBadge, Button } from "../../components/admin/ui";
import { Icon, type AdminIconName } from "../../components/admin/Icon";

// ------------------------------------------------------------- helpers ------
type Accent = "dark" | "green" | "blue" | "violet" | "amber" | "rose";

const ACCENT_CHIP: Record<Accent, string> = {
  dark: "bg-gray-900 text-white",
  green: "bg-green-50 text-green-600",
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

const STATUS_BAR: Record<string, string> = {
  pending: "bg-amber-400",
  paid: "bg-blue-400",
  shipping: "bg-indigo-400",
  done: "bg-green-500",
  cancelled: "bg-rose-400",
};

function StatCard({
  icon,
  label,
  value,
  hint,
  to,
  accent,
}: {
  icon: AdminIconName;
  label: string;
  value: string | number;
  hint?: string;
  to?: string;
  accent: Accent;
}) {
  const body = (
    <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{label}</p>
          <h2 className="mt-2 truncate text-2xl font-bold text-gray-900">{value}</h2>
          {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ACCENT_CHIP[accent]}`}
        >
          <Icon name={icon} className="h-5 w-5" />
        </div>
      </div>
      {to && (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-400 transition group-hover:text-gray-900">
          Xem chi tiết <Icon name="arrowRight" className="h-3.5 w-3.5" />
        </div>
      )}
    </Card>
  );
  return to ? (
    <Link to={to} className="group block">
      {body}
    </Link>
  ) : (
    body
  );
}

function MiniStat({
  icon,
  label,
  value,
  to,
  accent,
}: {
  icon: AdminIconName;
  label: string;
  value: string | number;
  to?: string;
  accent: Accent;
}) {
  const body = (
    <Card className="flex h-full items-center gap-3 p-4 transition hover:shadow-md">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${ACCENT_CHIP[accent]}`}
      >
        <Icon name={icon} className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </Card>
  );
  return to ? (
    <Link to={to} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

// ----------------------------------------------------------- component ------
export default function AdminDashboard() {
  const user = useAuth((state) => state.user);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setRefreshing(true);
      setStats(await adminApi.get<Stats>("/stats"));
    } catch (e) {
      toast.error(apiMessage(e, "Không tải được thống kê"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingState />;
  if (!stats) return null;

  const hour = new Date().getHours();
  const greeting =
    hour < 11
      ? "Chào buổi sáng"
      : hour < 14
        ? "Chào buổi trưa"
        : hour < 18
          ? "Chào buổi chiều"
          : "Chào buổi tối";
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalStatus = ORDER_STATUSES.reduce(
    (sum, s) => sum + (stats.ordersByStatus[s] ?? 0),
    0,
  );
  const paidOrders =
    (stats.ordersByStatus.paid ?? 0) +
    (stats.ordersByStatus.shipping ?? 0) +
    (stats.ordersByStatus.done ?? 0);
  const aov = paidOrders > 0 ? stats.revenue / paidOrders : 0;
  const inactiveProducts = Math.max(stats.productCount - stats.activeProductCount, 0);

  const quickActions: {
    to: string;
    label: string;
    desc: string;
    icon: AdminIconName;
    accent: Accent;
  }[] = [
    {
      to: "/admin/products",
      label: "Quản lý sản phẩm",
      desc: "Thêm & chỉnh sửa sản phẩm",
      icon: "box",
      accent: "blue",
    },
    {
      to: "/admin/orders",
      label: "Xử lý đơn hàng",
      desc: "Cập nhật trạng thái đơn",
      icon: "cart",
      accent: "green",
    },
    {
      to: "/admin/variants",
      label: "Kiểm tra tồn kho",
      desc: "Biến thể & số lượng",
      icon: "layers",
      accent: "violet",
    },
    {
      to: "/admin/reviews",
      label: "Duyệt đánh giá",
      desc: `${stats.pendingReviews} đang chờ duyệt`,
      icon: "star",
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------- Header -- */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm capitalize text-gray-500">{today}</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {greeting}, {user?.name || "Quản trị viên"} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tổng quan hoạt động cửa hàng {"L'Essence Noire"}.
          </p>
        </div>
        <Button variant="secondary" onClick={load} disabled={refreshing}>
          <Icon name="refresh" className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* ------------------------------------------------- Primary KPIs -- */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="revenue"
          accent="dark"
          label="Doanh thu"
          value={formatVnd(stats.revenue)}
          hint={`TB ${formatVnd(aov)} / đơn`}
        />
        <StatCard
          icon="cart"
          accent="green"
          label="Đơn hàng"
          value={stats.orderCount}
          hint={`${stats.ordersByStatus.pending ?? 0} chờ xử lý`}
          to="/admin/orders"
        />
        <StatCard
          icon="box"
          accent="blue"
          label="Sản phẩm"
          value={stats.productCount}
          hint={`${stats.activeProductCount} đang bán · ${inactiveProducts} ẩn`}
          to="/admin/products"
        />
        <StatCard
          icon="users"
          accent="violet"
          label="Người dùng"
          value={stats.userCount}
          hint={`${stats.adminCount} quản trị viên`}
          to="/admin/users"
        />
      </div>

      {/* ----------------------------------------------- Secondary KPIs -- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiniStat
          icon="layers"
          accent="violet"
          label="Biến thể"
          value={stats.variantCount}
          to="/admin/variants"
        />
        <MiniStat
          icon="tag"
          accent="blue"
          label="Thương hiệu"
          value={stats.brandCount}
          to="/admin/brands"
        />
        <MiniStat
          icon="folder"
          accent="green"
          label="Danh mục"
          value={stats.categoryCount}
          to="/admin/categories"
        />
        <MiniStat
          icon="star"
          accent="amber"
          label="Đánh giá chờ duyệt"
          value={stats.pendingReviews}
          to="/admin/reviews"
        />
      </div>

      {/* --------------------------------------------- Low-stock alert -- */}
      {stats.lowStockCount > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <Icon name="alert" className="h-5 w-5" />
          </div>
          <p className="flex-1">
            Có <b>{stats.lowStockCount}</b> biến thể sắp hết hàng (tồn ≤ 5). Hãy bổ
            sung kho sớm để tránh gián đoạn bán hàng.
          </p>
          <Link
            to="/admin/variants"
            className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
          >
            Kiểm tra tồn kho
          </Link>
        </div>
      )}

      {/* ----------------------------------------- Status + recent grid -- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Orders by status */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Đơn theo trạng thái</h3>
            <span className="text-xs text-gray-400">{totalStatus} đơn</span>
          </div>
          <ul className="space-y-4">
            {ORDER_STATUSES.map((s) => {
              const count = stats.ordersByStatus[s] ?? 0;
              const pct = totalStatus > 0 ? Math.round((count / totalStatus) * 100) : 0;
              return (
                <li key={s}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${STATUS_BAR[s] || "bg-gray-400"}`}
                      />
                      <span className="text-gray-700">{ORDER_STATUS_LABEL[s] || s}</span>
                    </span>
                    <span className="font-semibold text-gray-900">
                      {count}
                      <span className="ml-1 text-xs font-normal text-gray-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${STATUS_BAR[s] || "bg-gray-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Recent orders */}
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Đơn hàng gần đây</h3>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900"
            >
              Tất cả đơn <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">Chưa có đơn hàng nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                    <th className="pb-2 font-medium">Mã</th>
                    <th className="pb-2 font-medium">Khách</th>
                    <th className="pb-2 font-medium">SL</th>
                    <th className="pb-2 font-medium">Tổng</th>
                    <th className="pb-2 font-medium">Trạng thái</th>
                    <th className="pb-2 font-medium">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-gray-50 transition last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-2.5">
                        <Link
                          to="/admin/orders"
                          className="font-mono text-xs font-semibold text-gray-900 hover:underline"
                        >
                          #{o.id.slice(-6).toUpperCase()}
                        </Link>
                      </td>
                      <td className="py-2.5 text-gray-700">{o.customer}</td>
                      <td className="py-2.5 text-gray-500">{o.itemCount}</td>
                      <td className="py-2.5 font-medium text-gray-900">{formatVnd(o.total)}</td>
                      <td className="py-2.5">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="py-2.5 text-xs text-gray-500">{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* --------------------------------------------- Quick actions ----- */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-gray-900">Lối tắt</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link key={a.to} to={a.to} className="group block">
              <Card className="flex h-full items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ACCENT_CHIP[a.accent]}`}
                >
                  <Icon name={a.icon} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{a.label}</p>
                  <p className="truncate text-xs text-gray-400">{a.desc}</p>
                </div>
                <Icon
                  name="arrowRight"
                  className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:text-gray-900"
                />
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
