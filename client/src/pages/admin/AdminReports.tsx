import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BarChart3, Boxes, CircleDollarSign, ClipboardList, Download, Users, Workflow } from "lucide-react";
import { adminApi, apiMessage, formatDate, formatVnd } from "../../lib/adminApi";
import { toast } from "../../store/toast.store";
import { Badge, Button, Card, EmptyState, Field, Input, LoadingState, PageHeader, Select } from "../../components/admin/ui";

type SeriesRow = { key: string; revenue: number; expenses: number; cashFlow: number; orders: number };
type ProductRow = { id: string; name: string; category: string; stock: number; inventoryValue: number; revenue: number; quantity: number; cogs: number; margin: number | null };
type Expense = { id: string; type: string; amount: number; date: string; note: string };
type SupportItem = { id: string; name: string; email: string; subject: string; message: string; status: string; createdAt: string; resolvedAt: string | null };
type ReportData = {
  range: { from: string; to: string; granularity: string };
  revenue: {
    total: number; paidOrderCount: number; previous: number; previousChange: number; yoy: number; yoyChange: number;
    byCategory: { name: string; value: number }[]; byProduct: ProductRow[]; series: SeriesRow[];
  };
  orders: { total: number; statusCounts: Record<string, number>; aov: number; cancellationRate: number; returnRate: number; series: SeriesRow[] };
  inventory: { top: ProductRow[]; slow: ProductRow[]; products: ProductRow[]; inventoryValue: number; turnover: number | null; lowStock: number; costCoverage: number };
  customers: { newCustomers: number; returningCustomers: number; clv: number; retentionRate: number; segments: Record<string, number>; totalWithOrders: number; registered: number };
  finance: { revenue: number; cogs: number; grossProfit: number; operatingExpenses: number; netProfit: number; expenseByType: { type: string; amount: number }[]; series: SeriesRow[]; costCoverage: number; expenses: Expense[] };
  operations: {
    averageProcessingHours: number | null; averageDeliveryHours: number | null; timingCoverage: number;
    paymentMethods: { method: string; count: number; amount: number }[];
    support: { total: number; open: number; resolved: number; byStatus?: Record<string, number>; averageResolutionHours: number | null };
    supportRequests: SupportItem[];
  };
};

const TABS = [
  { id: "revenue", label: "Doanh thu", icon: BarChart3 },
  { id: "orders", label: "Đơn hàng", icon: ClipboardList },
  { id: "inventory", label: "Sản phẩm & tồn kho", icon: Boxes },
  { id: "customers", label: "Khách hàng", icon: Users },
  { id: "finance", label: "Tài chính", icon: CircleDollarSign },
  { id: "operations", label: "Vận hành", icon: Workflow },
] as const;

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xử lý", shipping: "Đang giao", done: "Hoàn tất", cancelled: "Đã hủy", returned: "Hoàn trả",
};
const SEGMENT_LABELS: Record<string, string> = { new: "Mua lần đầu", returning: "Quay lại", loyal: "Trung thành", vip: "VIP" };
const EXPENSE_LABELS: Record<string, string> = { shipping: "Vận chuyển", marketing: "Marketing", returns: "Hoàn hàng", operations: "Vận hành", other: "Khác" };
const CHART_COLORS = ["#181817", "#76682E", "#A39153", "#8F9A8C", "#C9C3B8", "#B66355", "#D8D2C7"];
const STATUS_COLORS: Record<string, string> = {
  pending: "#A39153",
  shipping: "#8F9A8C",
  done: "#181817",
  cancelled: "#B66355",
  returned: "#8F5D57",
};
// Trang thai yeu cau ho tro / khieu nai.
const SUPPORT_STATUS_LABELS: Record<string, string> = { open: "Mới", in_progress: "Đang xử lý", resolved: "Đã giải quyết", closed: "Đã đóng" };
const SUPPORT_STATUS_KEYS = ["open", "in_progress", "resolved", "closed"] as const;
const SUPPORT_STATUS_COLORS: Record<string, string> = { open: "#B66355", in_progress: "#A39153", resolved: "#5C8A5E", closed: "#8F9A8C" };

function inputDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function pct(value: number | null | undefined) {
  return value == null ? "Chưa đủ dữ liệu" : `${value.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`;
}

function hours(value: number | null) {
  if (value == null) return "Chưa đủ dữ liệu";
  if (value >= 24) return `${(value / 24).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} ngày`;
  return `${value.toLocaleString("vi-VN", { maximumFractionDigits: 1 })} giờ`;
}

function compact(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function chartValue(value: number, money?: boolean) {
  return money ? formatVnd(value) : value.toLocaleString("vi-VN");
}

function Kpi({ label, value, hint, tone = "dark" }: { label: string; value: string | number; hint?: string; tone?: "dark" | "red" | "gold" }) {
  const color = tone === "red" ? "text-red-700" : tone === "gold" ? "text-[#75621E]" : "text-gray-950";
  return (
    <div className="min-w-0 border-t border-gray-200 py-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">{label}</p>
      <p className={`mt-2 break-words font-title text-2xl ${color}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Card className="overflow-hidden rounded-md shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-700">{title}</h2>
        {action}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </Card>
  );
}

function DonutChart({ rows, center, money = false }: { rows: { label: string; value: number; color?: string }[]; center: string; money?: boolean }) {
  const normalized = rows.filter((row) => row.value > 0);
  const total = normalized.reduce((sum, row) => sum + row.value, 0);
  if (!total) return <EmptyState message="Chưa có dữ liệu để hiển thị biểu đồ." />;
  let cursor = 0;
  const gradient = normalized
    .map((row, index) => {
      const start = cursor;
      cursor += (row.value / total) * 100;
      return `${row.color || CHART_COLORS[index % CHART_COLORS.length]} ${start}% ${cursor}%`;
    })
    .join(", ");
  return (
    <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)]">
      <div className="flex justify-center">
        <div className="relative h-40 w-40 rounded-full" style={{ background: `conic-gradient(${gradient})` }}>
          <div className="absolute inset-[15px] flex flex-col items-center justify-center rounded-full bg-white text-center">
            <span className="font-title text-2xl text-gray-950">{center}</span>
            <span className="mt-1 text-[9px] uppercase tracking-[0.12em] text-gray-500">Tổng</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 self-center">
        {normalized.map((row, index) => {
          const percent = Math.round((row.value / total) * 100);
          const color = row.color || CHART_COLORS[index % CHART_COLORS.length];
          return (
            <div key={row.label}>
              <div className="mb-1 flex items-center gap-2 text-xs">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
                <span className="min-w-0 flex-1 truncate text-gray-700">{row.label}</span>
                <span className="text-gray-500">{percent}%</span>
                <strong className="min-w-16 text-right text-gray-950">{chartValue(row.value, money)}</strong>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#EEEAE3]">
                <div className="h-full rounded-full" style={{ width: `${percent}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HorizontalBars({ rows, money = false, limit = 8 }: { rows: { label: string; value: number; meta?: string; color?: string }[]; money?: boolean; limit?: number }) {
  const visibleRows = rows.filter((row) => row.value > 0).slice(0, limit);
  const max = Math.max(1, ...visibleRows.map((row) => row.value));
  if (!visibleRows.length) return <EmptyState message="Chưa có dữ liệu để hiển thị biểu đồ." />;
  return (
    <div className="space-y-4">
      {visibleRows.map((row, index) => {
        const color = row.color || CHART_COLORS[index % CHART_COLORS.length];
        return (
          <div key={`${row.label}-${index}`} className="grid gap-2 sm:grid-cols-[minmax(0,190px)_minmax(160px,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900" title={row.label}>{row.label}</p>
              {row.meta && <p className="mt-0.5 truncate text-[11px] text-gray-400">{row.meta}</p>}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#EEEAE3]">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(4, (row.value / max) * 100)}%`, background: color }} />
            </div>
            <strong className="text-right text-xs text-gray-950">{chartValue(row.value, money)}</strong>
          </div>
        );
      })}
    </div>
  );
}

function SeriesChart({ rows, field, money = false }: { rows: SeriesRow[]; field: keyof Pick<SeriesRow, "revenue" | "orders" | "cashFlow">; money?: boolean }) {
  const width = 900;
  const height = 300;
  const padX = 38;
  const padY = 34;
  if (!rows.length) return <EmptyState message="Chưa có dữ liệu trong kỳ này." />;
  const values = rows.map((row) => Number(row[field] || 0));
  const minValue = field === "cashFlow" ? Math.min(0, ...values) : 0;
  const maxValue = Math.max(1, ...values);
  const range = Math.max(1, maxValue - minValue);
  const xOf = (index: number) => rows.length === 1 ? width / 2 : padX + (index / (rows.length - 1)) * (width - padX * 2);
  const yOf = (value: number) => height - padY - ((value - minValue) / range) * (height - padY * 2);
  const zeroY = yOf(0);
  const points = values.map((value, index) => ({ x: xOf(index), y: yOf(value), value, key: rows[index].key }));
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const area = points.length
    ? `${line} L${points[points.length - 1].x},${zeroY} L${points[0].x},${zeroY} Z`
    : "";
  const avg = values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
  const chartId = `reportChart-${field}`;
  const isBars = field === "orders" || field === "cashFlow";
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="block h-[300px] w-full" role="img" aria-label="Biểu đồ báo cáo theo thời gian">
          <defs>
            <linearGradient id={`${chartId}-area`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#76682E" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#76682E" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padY + ratio * (height - padY * 2);
            const value = maxValue - ratio * range;
            return (
              <g key={ratio}>
                <line x1={padX} x2={width - padX} y1={y} y2={y} stroke="#E7E2D9" strokeWidth="1" />
                <text x="4" y={y + 4} fill="#9B958B" fontSize="10">{money ? compact(value) : Math.round(value)}</text>
              </g>
            );
          })}
          <line x1={padX} x2={width - padX} y1={zeroY} y2={zeroY} stroke="#C9C3B8" strokeWidth="1.2" />
          {!isBars && area && <path d={area} fill={`url(#${chartId}-area)`} />}
          {isBars && points.map((point, index) => {
            const barWidth = Math.min(34, Math.max(12, (width - padX * 2) / rows.length - 8));
            const y = Math.min(point.y, zeroY);
            const barHeight = Math.max(3, Math.abs(point.y - zeroY));
            return (
              <g key={point.key}>
                <rect
                  x={point.x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="6"
                  fill={point.value < 0 ? "#B66355" : index === points.length - 1 ? "#181817" : "#A39153"}
                />
                <title>{`${point.key}: ${chartValue(point.value, money)}`}</title>
              </g>
            );
          })}
          {line && (
            <path
              d={line}
              fill="none"
              stroke={field === "cashFlow" ? "#76682E" : "#181817"}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
          <line x1={padX} x2={width - padX} y1={yOf(avg)} y2={yOf(avg)} stroke="#B9AA78" strokeDasharray="5 7" strokeWidth="1.2" />
          {points.map((point, index) => (
            <g key={`${point.key}-dot`}>
              <circle cx={point.x} cy={point.y} r={index === points.length - 1 ? 5 : 3} fill={index === points.length - 1 ? "#181817" : "#76682E"} stroke="#FCF9F4" strokeWidth="2" />
              <title>{`${point.key}: ${chartValue(point.value, money)}`}</title>
            </g>
          ))}
        </svg>
        <div className="grid auto-cols-fr grid-flow-col gap-2 border-t border-[#E7E2D9] pt-3">
          {rows.map((row) => (
            <div key={row.key} className="min-w-0 text-center">
              <p className="truncate text-[10px] text-gray-500">{row.key}</p>
              <p className="mt-1 truncate text-[9px] text-gray-400">{chartValue(Number(row[field] || 0), money)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductTable({ rows, mode }: { rows: ProductRow[]; mode: "sales" | "stock" | "margin" }) {
  if (!rows.length) return <EmptyState message="Chưa có dữ liệu sản phẩm." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead><tr className="border-b text-[10px] uppercase tracking-wider text-gray-400"><th className="py-3">Sản phẩm</th><th>Danh mục</th><th className="text-right">Đã bán</th><th className="text-right">Doanh thu</th>{mode !== "sales" && <th className="text-right">Tồn kho</th>}{mode === "margin" && <th className="text-right">Biên LN</th>}</tr></thead>
        <tbody>{rows.map((row) => <tr key={row.id} className="border-b border-gray-100"><td className="py-3 pr-4 font-medium">{row.name}</td><td className="pr-4 text-gray-500">{row.category}</td><td className="text-right">{row.quantity}</td><td className="text-right">{formatVnd(row.revenue)}</td>{mode !== "sales" && <td className="text-right">{row.stock}</td>}{mode === "margin" && <td className="text-right">{row.margin == null ? "—" : pct(row.margin)}</td>}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default function AdminReports() {
  const { tab: routeTab } = useParams();
  const navigate = useNavigate();
  const tab = TABS.some((item) => item.id === routeTab) ? routeTab! : "revenue";
  const today = useMemo(() => new Date(), []);
  const initialFrom = useMemo(() => { const value = new Date(today); value.setDate(value.getDate() - 29); return inputDate(value); }, [today]);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(inputDate(today));
  const [granularity, setGranularity] = useState("day");
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expense, setExpense] = useState({ type: "shipping", amount: "", date: inputDate(today), note: "" });
  const [savingExpense, setSavingExpense] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setData(await adminApi.get<ReportData>("/reports", { from, to, granularity }));
    } catch (error) {
      toast.error(apiMessage(error, "Không tải được báo cáo"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [from, to, granularity]);
  useEffect(() => { if (routeTab && !TABS.some((item) => item.id === routeTab)) navigate("/admin/reports/revenue", { replace: true }); }, [routeTab, navigate]);

  async function addExpense() {
    if (!expense.amount || Number(expense.amount) <= 0) return toast.error("Nhập chi phí hợp lệ");
    try {
      setSavingExpense(true);
      await adminApi.post("/expenses", { ...expense, amount: Number(expense.amount) });
      setExpense((value) => ({ ...value, amount: "", note: "" }));
      toast.success("Đã ghi nhận chi phí");
      await load();
    } catch (error) { toast.error(apiMessage(error, "Không lưu được chi phí")); }
    finally { setSavingExpense(false); }
  }

  async function removeExpense(id: string) {
    try { await adminApi.del(`/expenses/${id}`); toast.success("Đã xóa chi phí"); await load(); }
    catch (error) { toast.error(apiMessage(error, "Không xóa được chi phí")); }
  }

  async function updateSupport(id: string, status: string) {
    try { await adminApi.patch(`/support/${id}/status`, { status }); toast.success("Đã cập nhật yêu cầu"); await load(); }
    catch (error) { toast.error(apiMessage(error, "Không cập nhật được yêu cầu")); }
  }

  function exportReport() {
    if (!data) return;
    const win = window.open("", "_blank", "width=900,height=1000");
    if (!win) { toast.error("Trình duyệt đang chặn cửa sổ in. Hãy cho phép popup để xuất báo cáo."); return; }
    const generatedAt = new Date().toLocaleString("vi-VN");
    const statusRows = Object.entries(data.orders.statusCounts).map(([s, c]) => `<tr><td>${STATUS_LABELS[s] || s}</td><td style="text-align:right">${c}</td></tr>`).join("");
    const topRows = data.inventory.top.slice(0, 8).map((r) => `<tr><td>${r.name}</td><td style="text-align:right">${r.quantity}</td><td style="text-align:right">${formatVnd(r.revenue)}</td></tr>`).join("");
    const slowRows = data.inventory.slow.slice(0, 8).map((r) => `<tr><td>${r.name}</td><td style="text-align:right">${r.stock}</td><td style="text-align:right">${r.quantity}</td></tr>`).join("");
    const supportRows = SUPPORT_STATUS_KEYS.map((s) => `<tr><td>${SUPPORT_STATUS_LABELS[s]}</td><td style="text-align:right">${data.operations.support.byStatus?.[s] ?? 0}</td></tr>`).join("");
    const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Báo cáo kinh doanh — L'Essence Noire</title><style>*{box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;color:#201f1b;margin:0;padding:40px;background:#fff}.head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #927A20;padding-bottom:16px;margin-bottom:8px}.brand{font-size:26px;letter-spacing:3px;font-weight:600;color:#927A20}.sub{font-size:12px;color:#6b6558;margin-top:4px}h2{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#927A20;margin:26px 0 10px;border-bottom:1px solid #e6e0d3;padding-bottom:6px}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.kpi{border:1px solid #ece7dd;border-radius:8px;padding:12px}.kpi .l{font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#8a8373}.kpi .v{font-size:18px;font-weight:600;margin-top:6px}table{width:100%;border-collapse:collapse;font-size:12px;margin-top:6px}th,td{border-bottom:1px solid #eee;padding:6px 8px;text-align:left}th{font-size:10px;text-transform:uppercase;color:#8a8373}.foot{margin-top:36px;font-size:10px;color:#9b958b;text-align:center;border-top:1px solid #e6e0d3;padding-top:12px}@media print{body{padding:16px}}</style></head><body><div class="head"><div><div class="brand">L'ESSENCE NOIRE</div><div class="sub">Báo cáo kinh doanh</div></div><div class="sub" style="text-align:right">Kỳ: ${formatDate(data.range.from)} – ${formatDate(data.range.to)}<br>Xuất lúc: ${generatedAt}</div></div><h2>Doanh thu</h2><div class="kpis"><div class="kpi"><div class="l">Doanh thu thực nhận</div><div class="v">${formatVnd(data.revenue.total)}</div></div><div class="kpi"><div class="l">So kỳ trước</div><div class="v">${pct(data.revenue.previousChange)}</div></div><div class="kpi"><div class="l">So cùng kỳ năm trước</div><div class="v">${pct(data.revenue.yoyChange)}</div></div><div class="kpi"><div class="l">Đơn đã thu tiền</div><div class="v">${data.revenue.paidOrderCount}</div></div></div><h2>Đơn hàng</h2><div class="kpis"><div class="kpi"><div class="l">Tổng đơn</div><div class="v">${data.orders.total}</div></div><div class="kpi"><div class="l">Giá trị đơn TB</div><div class="v">${formatVnd(data.orders.aov)}</div></div><div class="kpi"><div class="l">Tỷ lệ hủy/hoàn</div><div class="v">${pct(data.orders.cancellationRate)}</div></div><div class="kpi"><div class="l">Tỷ lệ hoàn trả</div><div class="v">${pct(data.orders.returnRate)}</div></div></div><table><thead><tr><th>Trạng thái đơn</th><th style="text-align:right">Số lượng</th></tr></thead><tbody>${statusRows}</tbody></table><h2>Tài chính</h2><div class="kpis"><div class="kpi"><div class="l">Doanh thu</div><div class="v">${formatVnd(data.finance.revenue)}</div></div><div class="kpi"><div class="l">Giá vốn</div><div class="v">${formatVnd(data.finance.cogs)}</div></div><div class="kpi"><div class="l">Lợi nhuận gộp</div><div class="v">${formatVnd(data.finance.grossProfit)}</div></div><div class="kpi"><div class="l">Lợi nhuận ròng</div><div class="v">${formatVnd(data.finance.netProfit)}</div></div></div><h2>Tồn kho — Bán chạy nhất</h2><table><thead><tr><th>Sản phẩm</th><th style="text-align:right">Đã bán</th><th style="text-align:right">Doanh thu</th></tr></thead><tbody>${topRows}</tbody></table><h2>Tồn kho — Bán chậm nhất (số dư cao)</h2><table><thead><tr><th>Sản phẩm</th><th style="text-align:right">Tồn kho</th><th style="text-align:right">Đã bán</th></tr></thead><tbody>${slowRows}</tbody></table><h2>Khách hàng</h2><div class="kpis"><div class="kpi"><div class="l">Khách mới</div><div class="v">${data.customers.newCustomers}</div></div><div class="kpi"><div class="l">Khách quay lại</div><div class="v">${data.customers.returningCustomers}</div></div><div class="kpi"><div class="l">CLV</div><div class="v">${formatVnd(data.customers.clv)}</div></div><div class="kpi"><div class="l">Tỷ lệ giữ chân</div><div class="v">${pct(data.customers.retentionRate)}</div></div></div><h2>Hỗ trợ khách hàng</h2><table><thead><tr><th>Trạng thái</th><th style="text-align:right">Số lượng</th></tr></thead><tbody>${supportRows}</tbody></table><div class="foot">© ${new Date().getFullYear()} L'Essence Noire · Báo cáo tạo tự động từ hệ thống quản trị</div></body></html>`;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }

  return (
    <div>
      <PageHeader title="Báo cáo kinh doanh" subtitle="Số liệu thực tế từ đơn hàng, thanh toán, tồn kho và yêu cầu hỗ trợ" actions={<Button variant="secondary" onClick={exportReport} disabled={loading || !data}><Download className="h-4 w-4" />Xuất báo cáo (PDF)</Button>} />

      <div className="mb-5 flex gap-1 overflow-x-auto border-b border-gray-200">
        {TABS.map((item) => { const Icon = item.icon; return <Link key={item.id} to={`/admin/reports/${item.id}`} className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-xs font-medium ${tab === item.id ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"}`}><Icon className="h-4 w-4" />{item.label}</Link>; })}
      </div>

      <div className="mb-6 grid gap-3 border-b border-gray-200 pb-5 sm:grid-cols-3 lg:max-w-3xl">
        <Field label="Từ ngày"><Input type="date" value={from} max={to} onChange={(event) => setFrom(event.target.value)} /></Field>
        <Field label="Đến ngày"><Input type="date" value={to} min={from} onChange={(event) => setTo(event.target.value)} /></Field>
        <Field label="Nhóm theo"><Select value={granularity} onChange={(event) => setGranularity(event.target.value)}><option value="day">Ngày</option><option value="week">Tuần</option><option value="month">Tháng</option><option value="quarter">Quý</option><option value="year">Năm</option></Select></Field>
      </div>

      {loading || !data ? <LoadingState /> : (
        <div className="space-y-5">
          {tab === "revenue" && <>
            <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4"><Kpi label="Doanh thu thực nhận" value={formatVnd(data.revenue.total)} hint="Tiền thực nhận từ đơn đã thanh toán (đã trừ hủy/hoàn)" /><Kpi label="So với kỳ trước" value={pct(data.revenue.previousChange)} hint={`Kỳ trước ${formatVnd(data.revenue.previous)}`} tone={data.revenue.previousChange < 0 ? "red" : "gold"} /><Kpi label="So với cùng kỳ năm trước" value={pct(data.revenue.yoyChange)} hint={`Cùng kỳ ${formatVnd(data.revenue.yoy)}`} tone={data.revenue.yoyChange < 0 ? "red" : "gold"} /><Kpi label="Đơn đã thu tiền" value={data.revenue.paidOrderCount} /></div>
            <Section title="Doanh thu theo thời gian"><SeriesChart rows={data.revenue.series} field="revenue" money /></Section>
            <div className="grid gap-5 xl:grid-cols-2"><Section title="Cơ cấu doanh thu theo danh mục"><DonutChart rows={data.revenue.byCategory.map((row, index) => ({ label: row.name, value: row.value, color: CHART_COLORS[index % CHART_COLORS.length] }))} center={formatVnd(data.revenue.total)} money /></Section><Section title="Top sản phẩm theo doanh thu"><HorizontalBars rows={data.revenue.byProduct.map((row, index) => ({ label: row.name, value: row.revenue, meta: `${row.quantity} sản phẩm`, color: CHART_COLORS[index % CHART_COLORS.length] }))} money /></Section></div>
            <Section title="Chi tiết doanh thu theo sản phẩm"><ProductTable rows={data.revenue.byProduct.slice(0, 12)} mode="sales" /></Section>
          </>}

          {tab === "orders" && <>
            <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4"><Kpi label="Tổng đơn đặt" value={data.orders.total} /><Kpi label="Giá trị đơn TB (AOV)" value={formatVnd(data.orders.aov)} hint="Doanh thu ÷ số đơn đã thanh toán" /><Kpi label="Tỷ lệ hủy / hoàn" value={pct(data.orders.cancellationRate)} hint="(Đơn hủy + hoàn) ÷ tổng đơn" tone="red" /><Kpi label="Tỷ lệ hoàn trả" value={pct(data.orders.returnRate)} tone="red" /></div>
            <Section title="Số lượng đơn theo thời gian"><SeriesChart rows={data.orders.series} field="orders" /></Section>
            <Section title="Cơ cấu trạng thái đơn"><DonutChart rows={Object.entries(data.orders.statusCounts).map(([status, count]) => ({ label: STATUS_LABELS[status] || status, value: count, color: STATUS_COLORS[status] || "#C9C3B8" }))} center={data.orders.total.toLocaleString("vi-VN")} /></Section>
          </>}

          {tab === "inventory" && <>
            <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4"><Kpi label="Giá trị tồn theo giá vốn" value={formatVnd(data.inventory.inventoryValue)} hint="Tổng (tồn kho × giá vốn) của tất cả SKU" /><Kpi label="Vòng quay tồn kho" value={data.inventory.turnover == null ? "Chưa đủ dữ liệu" : `${data.inventory.turnover.toFixed(2)} vòng`} hint="Giá vốn hàng bán ÷ giá trị tồn kho" /><Kpi label="SKU sắp hết" value={data.inventory.lowStock} tone="red" /><Kpi label="Độ phủ giá vốn" value={pct(data.inventory.costCoverage)} hint="Tỷ lệ sản phẩm bán ra đã có giá vốn" /></div>
            <div className="grid gap-5 xl:grid-cols-2"><Section title="Bán chạy nhất"><HorizontalBars rows={data.inventory.top.map((row, index) => ({ label: row.name, value: row.quantity, meta: formatVnd(row.revenue), color: CHART_COLORS[index % CHART_COLORS.length] }))} /></Section><Section title="Bán chậm nhất"><HorizontalBars rows={data.inventory.slow.map((row, index) => ({ label: row.name, value: Math.max(1, row.stock), meta: `${row.stock} tồn kho`, color: index === 0 ? "#B66355" : CHART_COLORS[(index + 2) % CHART_COLORS.length] }))} /></Section></div>
            <Section title="Tồn kho và biên lợi nhuận từng sản phẩm" action={<Link to="/admin/variants" className="text-xs font-medium text-[#75621E]">Cập nhật giá vốn & tồn kho</Link>}><ProductTable rows={data.inventory.products} mode="margin" /></Section>
          </>}

          {tab === "customers" && <>
            <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4"><Kpi label="Khách hàng mới" value={data.customers.newCustomers} /><Kpi label="Khách quay lại" value={data.customers.returningCustomers} /><Kpi label="Giá trị vòng đời TB (CLV)" value={formatVnd(data.customers.clv)} hint="Chi tiêu trung bình mỗi khách từng mua" /><Kpi label="Tỷ lệ giữ chân" value={pct(data.customers.retentionRate)} hint="Khách kỳ trước còn quay lại mua ở kỳ này" /></div>
            <Section title="Phân khúc theo hành vi mua"><DonutChart rows={Object.entries(data.customers.segments).map(([segment, count], index) => ({ label: SEGMENT_LABELS[segment] || segment, value: count, color: CHART_COLORS[index % CHART_COLORS.length] }))} center={data.customers.totalWithOrders.toLocaleString("vi-VN")} /><p className="mt-5 text-xs text-gray-500">Có {data.customers.totalWithOrders} khách từng mua trên tổng {data.customers.registered} tài khoản khách hàng.</p></Section>
          </>}

          {tab === "finance" && <>
            <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-5"><Kpi label="Doanh thu" value={formatVnd(data.finance.revenue)} /><Kpi label="Giá vốn" value={formatVnd(data.finance.cogs)} /><Kpi label="Lợi nhuận gộp" value={formatVnd(data.finance.grossProfit)} tone="gold" /><Kpi label="Chi phí vận hành" value={formatVnd(data.finance.operatingExpenses)} /><Kpi label="Lợi nhuận ròng" value={formatVnd(data.finance.netProfit)} tone={data.finance.netProfit < 0 ? "red" : "gold"} /></div>
            {data.finance.costCoverage < 100 && <div className="border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-xs text-amber-900">Lợi nhuận hiện có độ phủ giá vốn {pct(data.finance.costCoverage)}. Hãy nhập giá vốn cho các biến thể còn thiếu để báo cáo chính xác hoàn toàn.</div>}
            <Section title="Dòng tiền theo thời gian"><SeriesChart rows={data.finance.series} field="cashFlow" money /></Section>
            <Section title="Cơ cấu chi phí vận hành"><DonutChart rows={data.finance.expenseByType.map((item, index) => ({ label: EXPENSE_LABELS[item.type] || item.type, value: item.amount, color: CHART_COLORS[index % CHART_COLORS.length] }))} center={formatVnd(data.finance.operatingExpenses)} money /></Section>
            <Section title="Ghi nhận chi phí"><div className="grid gap-3 md:grid-cols-[160px_180px_160px_1fr_auto]"><Select value={expense.type} onChange={(e) => setExpense({ ...expense, type: e.target.value })}>{Object.entries(EXPENSE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select><Input type="number" min="1" placeholder="Số tiền" value={expense.amount} onChange={(e) => setExpense({ ...expense, amount: e.target.value })} /><Input type="date" value={expense.date} onChange={(e) => setExpense({ ...expense, date: e.target.value })} /><Input placeholder="Ghi chú" value={expense.note} onChange={(e) => setExpense({ ...expense, note: e.target.value })} /><Button onClick={addExpense} disabled={savingExpense}>{savingExpense ? "Đang lưu" : "Thêm"}</Button></div>{data.finance.expenses.length > 0 && <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[620px] text-sm"><thead><tr className="border-b text-left text-[10px] uppercase text-gray-400"><th className="py-3">Ngày</th><th>Loại</th><th>Ghi chú</th><th className="text-right">Số tiền</th><th /></tr></thead><tbody>{data.finance.expenses.map((item) => <tr key={item.id} className="border-b border-gray-100"><td className="py-3">{formatDate(item.date)}</td><td>{EXPENSE_LABELS[item.type] || item.type}</td><td className="text-gray-500">{item.note || "—"}</td><td className="text-right font-medium">{formatVnd(item.amount)}</td><td className="text-right"><button className="text-xs text-red-600" onClick={() => removeExpense(item.id)}>Xóa</button></td></tr>)}</tbody></table></div>}</Section>
          </>}

          {tab === "operations" && <>
            <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4"><Kpi label="Xử lý đơn trung bình" value={hours(data.operations.averageProcessingHours)} /><Kpi label="Giao hàng trung bình" value={hours(data.operations.averageDeliveryHours)} /><Kpi label="Độ phủ mốc thời gian" value={pct(data.operations.timingCoverage)} hint="Tỷ lệ đơn có đủ mốc thời gian để tính toán" /><Kpi label="Yêu cầu đang mở" value={data.operations.support.open} tone={data.operations.support.open ? "red" : "dark"} /></div>
            <div className="grid gap-5 xl:grid-cols-2"><Section title="Phương thức thanh toán"><DonutChart rows={data.operations.paymentMethods.map((item, index) => ({ label: item.method === "bank_qr" ? "Chuyển khoản QR" : "COD", value: item.amount, color: CHART_COLORS[index % CHART_COLORS.length] }))} center={formatVnd(data.operations.paymentMethods.reduce((sum, item) => sum + item.amount, 0))} money /><div className="mt-5"><HorizontalBars rows={data.operations.paymentMethods.map((item, index) => ({ label: item.method === "bank_qr" ? "Chuyển khoản QR" : "COD", value: item.count, meta: formatVnd(item.amount), color: CHART_COLORS[index % CHART_COLORS.length] }))} /></div></Section><Section title="Hỗ trợ khách hàng"><DonutChart rows={SUPPORT_STATUS_KEYS.map((s) => ({ label: SUPPORT_STATUS_LABELS[s], value: data.operations.support.byStatus?.[s] ?? 0, color: SUPPORT_STATUS_COLORS[s] }))} center={data.operations.support.total.toLocaleString("vi-VN")} /><div className="mt-5 grid gap-4 sm:grid-cols-3"><Kpi label="Tổng yêu cầu" value={data.operations.support.total} /><Kpi label="Đã xử lý" value={data.operations.support.resolved} /><Kpi label="TG xử lý TB" value={hours(data.operations.support.averageResolutionHours)} /></div></Section></div>
            <Section title="Khiếu nại / yêu cầu hỗ trợ">{data.operations.supportRequests.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b text-left text-[10px] uppercase text-gray-400"><th className="py-3">Khách hàng</th><th>Chủ đề</th><th>Nội dung</th><th>Ngày gửi</th><th>Trạng thái</th></tr></thead><tbody>{data.operations.supportRequests.map((item) => <tr key={item.id} className="border-b border-gray-100 align-top"><td className="py-3 pr-4"><p className="font-medium">{item.name}</p><p className="text-xs text-gray-500">{item.email}</p></td><td className="pr-4">{item.subject}</td><td className="max-w-xs pr-4 text-gray-500"><p className="line-clamp-2">{item.message}</p></td><td className="whitespace-nowrap pr-4 text-xs">{formatDate(item.createdAt)}</td><td><div className="inline-flex items-center gap-2 rounded-md border-l-4 py-0.5 pl-2" style={{ borderColor: SUPPORT_STATUS_COLORS[item.status] || "#C9C3B8" }}><span className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: (SUPPORT_STATUS_COLORS[item.status] || "#C9C3B8") + "22", color: SUPPORT_STATUS_COLORS[item.status] || "#6b6558" }}>{SUPPORT_STATUS_LABELS[item.status] || item.status}</span><Select className="min-w-32" value={item.status} onChange={(e) => updateSupport(item.id, e.target.value)}><option value="open">Mới</option><option value="in_progress">Đang xử lý</option><option value="resolved">Đã giải quyết</option><option value="closed">Đã đóng</option></Select></div></td></tr>)}</tbody></table></div> : <EmptyState message="Chưa có yêu cầu hỗ trợ trong kỳ." />}</Section>
          </>}
        </div>
      )}
    </div>
  );
}
