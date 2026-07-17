import {
  ArrowRight,
  ChevronRight,
  MapPin,
  Package,
  Plus,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../store/auth.store";

interface OrderItem {
  id: string;
  name: string;
  date: string;
  price: string;
  status: string;
}

interface RecommendationItem {
  id?: string;
  slug?: string;
  category: string;
  name: string;
  description: string;
  image: string;
  stock?: number;
}

const recommendations: RecommendationItem[] = [
  {
    category: "Eau de Parfum",
    name: "Encens Suprême",
    description:
      "Hương trầm khói hòa cùng gỗ bạch dương và vanilla ấm áp, phù hợp cho những ngày mùa đông.",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    category: "Intense Collection",
    name: "L'Or de Cuir",
    description:
      "Hương da thuộc cổ điển kết hợp nghệ tây và xạ hương, mang phong cách mạnh mẽ và sang trọng.",
    image:
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=1200&auto=format&fit=crop",
  },
  {
    category: "Floral Essence",
    name: "Noire Gardenia",
    description:
      "Hương hoa dành dành kết hợp tiêu đen, tạo nên cảm giác bí ẩn, thanh lịch và cuốn hút.",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1200&auto=format&fit=crop",
  },
];

const scentTags = ["Oud", "Amber", "Bergamot"];

export default function AccountOverview() {
  const user = useAuth((state) => state.user);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [items, setItems] = useState<RecommendationItem[]>(recommendations);
  const [refillProduct, setRefillProduct] = useState<RecommendationItem | null>(null);

  useEffect(() => {
    let mounted = true;

    api
      .get<any[]>("/account/orders")
      .then(({ data }) => {
        if (!mounted) return;
        setOrders(
          data.slice(0, 2).map((order) => ({
            id: order.id.slice(-6).toUpperCase(),
            name: order.firstItemName || "Đơn hàng",
            date: order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("vi-VN")
              : "Đang cập nhật",
            price: `${(order.total || 0).toLocaleString("vi-VN")}đ`,
            status: order.status,
          })),
        );
      })
      .catch(() => {
        if (mounted) setOrders([]);
      });

    api
      .get<{ data: any[] }>("/products", { params: { limit: 100, sort: "newest" } })
      .then(({ data }) => {
        if (!mounted || !Array.isArray(data.data) || data.data.length === 0) return;
        const products: RecommendationItem[] = data.data.map((product) => ({
          id: product.id,
          slug: product.slug,
          category: product.category || product.brand || "Parfum",
          name: product.name,
          description: product.description || "Mùi hương tinh tế, sang trọng.",
          image: product.images?.[0] || product.image || "https://placehold.co/800x600?text=No+Image",
          stock: product.stock || 0,
        }));

        setItems(products.slice(0, 3));
        setRefillProduct(
          products
            .filter((product) => (product.stock || 0) > 0)
            .sort((left, right) => (left.stock || 0) - (right.stock || 0))[0] ||
            products[0] ||
            null,
        );
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const defaultAddress = user?.addresses?.[0];
  const refillProductPath = refillProduct
    ? `/products/${refillProduct.slug || refillProduct.id}`
    : "/shop";

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#27231F]">
      <section className="border-b border-[#E8E1D8] px-6 pb-6 pt-12 lg:px-12">
        <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[#9A9186]">
          Cổng thông tin cá nhân
        </p>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h1 className="font-serif text-4xl font-normal lg:text-5xl">
            Xin chào, {user?.name || "bạn"}.
          </h1>

          <div className="md:text-right">
            <p className="text-[10px] italic text-[#8B837A]">
              Thành viên từ tháng 11 năm 2023
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#8C7200]">
              Thành viên Noir Elite
            </p>
          </div>
        </div>
      </section>

      <main className="space-y-14 px-6 py-10 lg:px-12">
        <section className="grid gap-5 xl:grid-cols-[2fr_1fr]">
          <div className="grid gap-6 bg-[#F3EFEA] p-6 sm:grid-cols-[1fr_220px] lg:p-8">
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-2xl">Hồ sơ mùi hương</h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-[#746C63]">
                Sở thích của bạn thiên về nhóm hương gỗ phương Đông, nổi bật
                với các nốt hương gỗ đàn hương, trầm hương và hổ phách.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {scentTags.map((item) => (
                  <span
                    key={item}
                    className="border border-[#D6CFC5] bg-[#FCF9F4] px-3 py-1 text-[9px] uppercase tracking-widest"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <Link
                to="/account/scent-profile"
                className="mt-6 flex w-fit items-center gap-3 bg-[#887000] px-6 py-3 text-[10px] uppercase tracking-[0.14em] text-white transition hover:bg-[#6D5900]"
              >
                Chỉnh sửa hồ sơ
                <ArrowRight size={13} />
              </Link>
            </div>

            <img
              src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop"
              alt="Hồ sơ mùi hương"
              className="h-64 w-full object-cover sm:h-full"
            />
          </div>

          <div className="flex flex-col justify-between bg-[#FFD65B] p-7 lg:p-8">
            <div>
              <h2 className="font-serif text-xl text-[#7E6700]">
                Sắp hết sản phẩm
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#907A21]">
                {refillProduct ? (
                  <>
                    <Link
                      to={refillProductPath}
                      className="font-semibold text-[#6D5900] underline-offset-4 hover:underline"
                    >
                      {refillProduct.name}
                    </Link>{" "}
                    đang còn {refillProduct.stock || 0} sản phẩm trong kho.
                  </>
                ) : (
                  "Chưa có sản phẩm nào cần theo dõi tồn kho."
                )}
              </p>
            </div>

            <Link
              to={refillProductPath}
              className="mt-8 flex items-center justify-center gap-3 bg-[#816900] px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-white transition hover:bg-[#685400]"
            >
              Xem chi tiết
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        <section className="grid gap-10 xl:grid-cols-2">
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="font-serif text-2xl">Đơn hàng gần đây</h2>

              <Link
                to="/account/orders"
                className="text-[9px] uppercase tracking-[0.15em] text-[#9A9186]"
              >
                Xem tất cả
              </Link>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-[56px_1fr_auto] items-center gap-4 border-l-2 border-[#B49A26] bg-[#F4F0EA] p-4 transition hover:bg-[#EEE8DF]"
                >
                  <div className="flex h-14 w-14 items-center justify-center bg-[#EAE5DE]">
                    <Package size={17} strokeWidth={1.3} />
                  </div>

                  <div>
                    <h3 className="font-serif text-base">{order.name}</h3>

                    <p className="mt-1 text-[10px] uppercase tracking-wide text-[#91887E]">
                      Đơn hàng #{order.id} · {order.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-serif text-sm">{order.price}</p>

                    <p className="mt-1 text-[9px] uppercase tracking-widest text-[#9B8415]">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="border border-[#E4DDD4] bg-[#FCF9F4] p-6 text-sm text-[#7D746B]">
                  Bạn chưa có đơn hàng nào.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="font-serif text-2xl">Địa chỉ đã lưu</h2>

              <Link
                to="/account/addresses"
                className="text-[9px] uppercase tracking-[0.15em] text-[#9A9186]"
              >
                Quản lý địa chỉ
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-[#E4DDD4] bg-[#FCF9F4] p-6">
                <p className="text-[9px] uppercase tracking-[0.18em] text-[#9A7F00]">
                  Địa chỉ mặc định
                </p>

                <div className="mt-5 flex gap-3">
                  <MapPin size={16} strokeWidth={1.3} className="mt-1 shrink-0" />

                  <div className="font-serif text-sm leading-6">
                    <p>{user?.name || "Chưa cập nhật"}</p>
                    <p>{defaultAddress?.detail || "Chưa có địa chỉ"}</p>
                    <p>{defaultAddress?.phone || ""}</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-5">
                  <Link to="/account/addresses" className="text-[9px] uppercase tracking-widest">
                    Chỉnh sửa
                  </Link>

                  <Link
                    to="/account/addresses"
                    className="text-[9px] uppercase tracking-widest text-[#9A9186]"
                  >
                    Xóa
                  </Link>
                </div>
              </div>

              <Link
                to="/account/addresses"
                className="flex min-h-[190px] flex-col items-center justify-center border border-dashed border-[#D9D1C7] bg-[#F2EEE9] transition hover:bg-[#EAE5DE]"
              >
                <Plus size={24} strokeWidth={1.2} />

                <span className="mt-3 text-[9px] uppercase tracking-[0.15em] text-[#827A71]">
                  Thêm địa chỉ mới
                </span>
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <Sparkles size={13} strokeWidth={1.2} />

              <p className="text-[9px] uppercase tracking-[0.35em] text-[#9A9186]">
                Dành riêng cho bạn
              </p>
            </div>

            <h2 className="mt-3 font-serif text-3xl italic lg:text-4xl">
              Gợi ý cho mùa đông
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {items.map((item) => (
              <article key={item.id || item.name} className="group">
                <div className="overflow-hidden bg-[#ECE7E0]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <p className="mt-5 text-[9px] uppercase tracking-[0.2em] text-[#9A9186]">
                  {item.category}
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <h3 className="font-serif text-xl">{item.name}</h3>

                  <ChevronRight
                    size={17}
                    strokeWidth={1.2}
                    className="transition group-hover:translate-x-1"
                  />
                </div>

                <p className="mt-3 text-sm leading-6 text-[#7D746B]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
