import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Package2, RefreshCw, ShoppingBag, TrendingUp } from 'lucide-react';
import { api } from '../../lib/api';

type DashboardPeriod = '7d' | '30d' | '90d';

type DashboardSummary = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockVariants: number;
};

type RevenuePoint = {
  date: string;
  revenue: number;
  orders: number;
};

type OrderStatusItem = {
  status: string;
  count: number;
};

type LowStockItem = {
  variantId: string;
  productId: string;
  productName: string;
  sku: string;
  stock: number;
};

type DashboardData = {
  period: DashboardPeriod;
  summary: DashboardSummary;
  revenueSeries: RevenuePoint[];
  orderStatusBreakdown: OrderStatusItem[];
  lowStockItems: LowStockItem[];
  generatedAt: string;
};

type DashboardApiResponse = {
  success: boolean;
  data: DashboardData;
};

type FilterState = {
  period: DashboardPeriod;
  lowStockThreshold: string;
};

const periodOptions: Array<{ value: DashboardPeriod; label: string }> = [
  { value: '7d', label: '7 ngày' },
  { value: '30d', label: '30 ngày' },
  { value: '90d', label: '90 ngày' },
];

const statusLabels: Record<string, string> = {
  pending: 'Chờ xử lý',
  paid: 'Đã thanh toán',
  shipping: 'Đang giao',
  done: 'Hoàn tất',
  cancelled: 'Đã hủy',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export default function AdminDashboard() {
  const [filters, setFilters] = useState<FilterState>({ period: '30d', lowStockThreshold: '5' });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({ period: '30d', lowStockThreshold: '5' });
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchDashboard = useCallback(async (nextFilters: FilterState, showLoading = true) => {
    const currentRequestId = ++requestIdRef.current;
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const { data } = await api.get<DashboardApiResponse>('/admin/dashboard', {
        params: {
          period: nextFilters.period,
          lowStockThreshold: nextFilters.lowStockThreshold,
        },
        signal: controller.signal,
      });

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setDashboard(data.data);
    } catch (err: unknown) {
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (typeof err === 'object' && err !== null && 'name' in err && (err as { name?: string }).name === 'CanceledError') {
        return;
      }

      const message =
        typeof err === 'object' && err !== null && 'response' in err &&
        err.response && typeof err.response === 'object' && 'data' in err.response &&
        err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
          ? String(err.response.data.message)
          : 'Không thể tải dữ liệu dashboard.';

      setError(message);
      setDashboard(null);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchDashboard(appliedFilters);

    return () => {
      controllerRef.current?.abort();
    };
  }, [appliedFilters, fetchDashboard]);

  const summaryCards = useMemo(() => {
    if (!dashboard) {
      return [];
    }

    return [
      {
        title: 'Tổng đơn hàng',
        value: dashboard.summary.totalOrders.toLocaleString('vi-VN'),
        icon: ShoppingBag,
        accent: 'from-amber-50 to-orange-50 text-amber-700',
      },
      {
        title: 'Tổng doanh thu',
        value: formatCurrency(dashboard.summary.totalRevenue),
        icon: TrendingUp,
        accent: 'from-emerald-50 to-lime-50 text-emerald-700',
      },
      {
        title: 'Đơn chờ xử lý',
        value: dashboard.summary.pendingOrders.toLocaleString('vi-VN'),
        icon: RefreshCw,
        accent: 'from-sky-50 to-cyan-50 text-sky-700',
      },
      {
        title: 'Biến thể sắp hết hàng',
        value: dashboard.summary.lowStockVariants.toLocaleString('vi-VN'),
        icon: Package2,
        accent: 'from-rose-50 to-red-50 text-rose-700',
      },
    ];
  }, [dashboard]);

  const revenueSeries = dashboard?.revenueSeries ?? [];
  const chartMaxRevenue = Math.max(...revenueSeries.map((item) => item.revenue), 1);
  const totalStatusCount = dashboard?.orderStatusBreakdown.reduce((sum, item) => sum + item.count, 0) ?? 0;

  const handleApply = () => {
    const normalizedThreshold = filters.lowStockThreshold.trim();
    const parsedThreshold = normalizedThreshold === '' ? 5 : Number(normalizedThreshold);

    if (!Number.isInteger(parsedThreshold) || parsedThreshold < 0) {
      setError('Ngưỡng tồn kho thấp phải là số nguyên không âm.');
      return;
    }

    const nextFilters: FilterState = {
      period: filters.period,
      lowStockThreshold: String(parsedThreshold),
    };

    setAppliedFilters(nextFilters);
    void fetchDashboard(nextFilters);
  };

  const handleRefresh = () => {
    void fetchDashboard(appliedFilters);
  };

  return (
    <div className="w-full min-w-0 max-w-none space-y-6">
      <div className="flex w-full max-w-none flex-col gap-4 overflow-hidden rounded-3xl border border-gray-200 bg-white/90 p-4 shadow-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full min-w-0 max-w-none">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Admin Dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">Tổng quan cửa hàng</h1>
          <p className="mt-2 w-full max-w-none text-sm leading-7 text-gray-600 sm:text-[15px]">
            Theo dõi doanh thu, trạng thái đơn hàng và biến thể cần cảnh báo tồn kho trong thời gian thực.
          </p>
        </div>

        <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 sm:w-auto">
          <div className="font-medium text-gray-800">Cập nhật lúc</div>
          <div className="break-words">{dashboard ? formatDateTime(dashboard.generatedAt) : 'Đang tải...'}</div>
        </div>
      </div>

      <div className="w-full max-w-none rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap lg:items-end">
            <label className="flex min-w-0 flex-1 flex-col text-sm font-medium text-gray-700 sm:max-w-[220px]">
              Khoảng thời gian
              <select
                value={filters.period}
                onChange={(event) => setFilters((current) => ({ ...current, period: event.target.value as DashboardPeriod }))}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0"
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex min-w-0 flex-1 flex-col text-sm font-medium text-gray-700 sm:max-w-[220px]">
              Ngưỡng tồn kho thấp
              <input
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={filters.lowStockThreshold}
                onChange={(event) => {
                  const nextValue = event.target.value.replace(/[^0-9]/g, '');
                  setFilters((current) => ({ ...current, lowStockThreshold: nextValue }));
                }}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleApply}
              className="w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
            >
              Áp dụng
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
            >
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="mt-4 h-8 w-20 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => void fetchDashboard(appliedFilters)}
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      ) : dashboard ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className={`inline-flex rounded-2xl bg-gradient-to-br p-3 ${card.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-500">{card.title}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">{card.value}</h2>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
            <section className="w-full min-w-0 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo ngày</h3>
                  <p className="mt-1 text-sm text-gray-500">Biểu đồ doanh thu từ dữ liệu backend</p>
                </div>
                <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                  {dashboard.period}
                </div>
              </div>

              {revenueSeries.length === 0 ? (
                <div className="mt-8 flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
                  Chưa có dữ liệu doanh thu trong khoảng thời gian này.
                </div>
              ) : (
                <div className="mt-6">
                  <div className="overflow-x-auto">
                    <svg viewBox="0 0 620 240" className="h-64 min-w-[560px] w-full">
                      <line x1="32" y1="200" x2="600" y2="200" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="32" y1="40" x2="32" y2="200" stroke="#e5e7eb" strokeWidth="1" />
                      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                        <line
                          key={ratio}
                          x1="32"
                          y1={40 + ratio * 160}
                          x2="600"
                          y2={40 + ratio * 160}
                          stroke="#f3f4f6"
                          strokeDasharray="4 4"
                        />
                      ))}

                      {revenueSeries.map((item, index) => {
                        const barWidth = 18;
                        const gap = 10;
                        const x = 48 + index * (barWidth + gap);
                        const height = (item.revenue / chartMaxRevenue) * 140;
                        const y = 200 - height;

                        return (
                          <g key={item.date}>
                            <rect x={x} y={y} width={barWidth} height={height} rx="5" fill="#f59e0b" opacity="0.9" />
                            <text x={x + 9} y="220" textAnchor="middle" fontSize="10" fill="#6b7280">
                              {item.date.slice(-2)}
                            </text>
                            <title>{`${item.date}: ${formatCurrency(item.revenue)} (${item.orders} đơn)`}</title>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-amber-500" />
                      Doanh thu
                    </span>
                    <span>Trục biểu đồ được xây dựng từ dữ liệu backend.</span>
                  </div>
                </div>
              )}
            </section>

            <section className="w-full min-w-0 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Trạng thái đơn hàng</h3>
                  <p className="mt-1 text-sm text-gray-500">Phân bố đơn theo trạng thái</p>
                </div>
              </div>

              {dashboard.orderStatusBreakdown.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  Không có đơn hàng trong khoảng thời gian này.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {dashboard.orderStatusBreakdown.map((item) => {
                    const percent = totalStatusCount === 0 ? 0 : Math.round((item.count / totalStatusCount) * 100);
                    return (
                      <div key={item.status}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{statusLabels[item.status] ?? item.status}</span>
                          <span className="text-gray-500">{item.count} đơn · {percent}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-gray-100">
                          <div className="h-2.5 rounded-full bg-gray-900" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <section className="w-full min-w-0 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sản phẩm tồn kho thấp</h3>
                <p className="mt-1 text-sm text-gray-500">Danh sách biến thể cần chú ý</p>
              </div>
              <div className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700">
                {dashboard.lowStockItems.length} mục
              </div>
            </div>

            {dashboard.lowStockItems.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
                Không có sản phẩm cần cảnh báo.
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-gray-500">
                      <th className="px-3 py-3 font-medium">Sản phẩm</th>
                      <th className="px-3 py-3 font-medium">SKU</th>
                      <th className="px-3 py-3 font-medium">Tồn kho</th>
                      <th className="px-3 py-3 font-medium">Mức cảnh báo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.lowStockItems.map((item) => {
                      const isOutOfStock = item.stock === 0;
                      const badgeClass = isOutOfStock
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700';
                      const label = isOutOfStock ? 'Hết hàng' : 'Sắp hết';

                      return (
                        <tr key={item.variantId} className="border-b border-gray-100 last:border-b-0">
                          <td className="px-3 py-3">
                            <div className="font-medium text-gray-900">{item.productName || 'Sản phẩm không còn tồn tại'}</div>
                          </td>
                          <td className="px-3 py-3 text-gray-600">{item.sku}</td>
                          <td className="px-3 py-3 text-gray-600">{item.stock}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                              {label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
