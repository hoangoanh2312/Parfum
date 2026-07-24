import { ArrowRight, Droplets, Leaf } from "lucide-react";
import { useSeo } from "../hooks/useSeo";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import Footer from "../components/Footer";
import AboutStoreMap from "../components/AboutStoreMap";
import { toast } from "../store/toast.store";

type ProductDetailItem = {
  id: string;
  slug?: string;
  name: string;
  image?: string | null;
  images?: string[];
  fragranceFamily?: string;
};

type ProductListResponse = {
  data: ProductDetailItem[];
};

const fallbackIngredients = [
  {
    name: "Hoa nhài nở đêm",
    image: "/images/about/jasmine.jpg",
  },
  {
    name: "Nhựa trầm hoang dã",
    image: "/images/about/oud-resin.jpg",
  },
  {
    name: "Tiêu hồng",
    image: "/images/about/baies-roses.jpg",
  },
  {
    name: "Cỏ hương bài Haiti",
    image: "/images/about/vetiver-1.jpg",
  },
  {
    name: "Cỏ hương bài Ấn Độ",
    image: "/images/about/vetiver-2.jpg",
  },
];

const policySections = [
  {
    id: "info",
    title: "Thông tin cửa hàng",
    label: "Thông tin cửa hàng",
    text: "Parfum Store tuyển chọn nước hoa chính hãng từ các thương hiệu uy tín, ưu tiên trải nghiệm tư vấn rõ ràng, sản phẩm minh bạch và dịch vụ sau bán hàng chỉn chu.",
  },
  {
    id: "returns",
    title: "Chính sách đổi trả",
    label: "Đổi trả",
    text: "Sản phẩm được hỗ trợ đổi trả khi còn nguyên seal, chưa qua sử dụng và có lỗi phát sinh từ vận chuyển hoặc nhà bán hàng. Khách vui lòng liên hệ trong vòng 7 ngày kể từ khi nhận hàng.",
  },
  {
    id: "shipping",
    title: "Vận chuyển",
    label: "Vận chuyển",
    text: "Đơn hàng được đóng gói chống sốc và bàn giao cho đơn vị vận chuyển trong thời gian sớm nhất. Phí vận chuyển và thời gian nhận hàng phụ thuộc khu vực giao hàng.",
  },
  {
    id: "warranty",
    title: "Bảo hành",
    label: "Bảo hành",
    text: "Parfum Store hỗ trợ xác minh sản phẩm, kiểm tra tình trạng vòi xịt, nắp chai và các lỗi kỹ thuật liên quan đến bao bì trong quá trình sử dụng ban đầu.",
  },
  {
    id: "contact",
    title: "Liên hệ",
    label: "Liên hệ",
    text: "Cần tư vấn mùi hương, hỗ trợ đơn hàng hoặc chính sách sau mua? Liên hệ qua hotline 0328 779 845 hoặc email tranvungochuynh136@gmail.com.",
  },
];

export default function About() {
  useSeo({
    title: "Về chúng tôi",
    description: "Câu chuyện thương hiệu, triết lý và cam kết chính hãng của L'Essence Noire.",
  });
  const [products, setProducts] = useState<ProductDetailItem[]>([]);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    let mounted = true;

    api
      .get<ProductListResponse>("/products", {
        params: { limit: 10, sort: "newest" },
      })
      .then(({ data }) => {
        if (mounted) setProducts(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => {
        if (mounted) setProducts([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const rawPaletteItems = useMemo(() => {
    const fromProducts = products.slice(0, 5).map((product, index) => ({
      name: product.name,
      caption: product.fragranceFamily || "Mùi hương đặc trưng",
      image:
        product.images?.[0] ||
        product.image ||
        fallbackIngredients[index % fallbackIngredients.length].image,
      to: `/products/${product.slug || product.id}`,
    }));

    return fromProducts.length
      ? fromProducts
      : fallbackIngredients.map((item) => ({
          ...item,
          caption: "Nguyên liệu thô",
          to: `/shop?scent=${encodeURIComponent(item.name)}`,
        }));
  }, [products]);

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error("Email không hợp lệ");
      return;
    }

    try {
      setSubscribing(true);
      await api.post("/blog/subscribe", { email: normalizedEmail });
      toast.success("Đã đăng ký nhận bản tin");
      setEmail("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể đăng ký nhận bản tin lúc này");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <>
      <main className="overflow-hidden bg-[#FCF9F4] text-[#201F1B]">
        {/* Giới thiệu đầu trang */}
        <section className="px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div className="mx-auto grid max-w-[1320px] items-end gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-0">
            <div className="relative z-10 pb-4 lg:translate-x-12">
              <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.35em] text-[#927A20]">
                Est. 1924
              </p>

              <h1
                className="max-w-[570px] text-[52px] leading-[0.9] tracking-[-0.04em] sm:text-[66px] lg:text-[78px]"
                style={{ fontFamily: "'Noto Serif', 'Noto Serif Display', serif" }}
              >
                Thuật giả kim của
                <br />
                những câu chuyện
                <br />
                <span className="italic">vô hình</span>
              </h1>

              <p className="mt-7 max-w-[455px] text-sm leading-6 text-[#69665F]">
                Chúng tôi tuyển chọn mùi hương không chỉ như sản phẩm, mà như những biên niên ký
                thầm lặng. Mỗi chai là một thư viện ký ức dạng lỏng, dành cho tâm hồn tinh tế.
              </p>
            </div>

            <div className="h-[420px] overflow-hidden bg-[#363636] sm:h-[520px] lg:h-[600px]">
              <img
                loading="lazy"
                src="https://res.cloudinary.com/dwj2trmn0/image/upload/v1784434420/perfume-bottle-green-plant-and-open-book-royalty-free-image-1760057187_x0ps86.avif"
                alt="Chai nước hoa cao cấp"
                className="h-full w-full object-cover grayscale"
              />
            </div>
          </div>
        </section>

        {/* Di sản */}
        <section className="bg-[#F2EFEA] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-[1260px] items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="max-w-[440px]">
              <h2
                className="text-4xl tracking-[-0.025em] lg:text-[48px]"
                style={{ fontFamily: "'Noto Serif', 'Noto Serif Display', serif" }}
              >
                Di sản của chúng tôi
              </h2>

              <div className="mt-7 space-y-5 text-sm leading-6 text-[#67645D]">
                <p>
                  Hành trình bắt đầu từ những ngọn đồi yên tĩnh của Grasse. Trước khi nước hoa trở
                  thành một ngành công nghiệp, đó là nghi thức của sự kiên nhẫn, cuộc đối thoại tinh
                  tế giữa đất, hoa và thủy tinh.
                </p>

                <p>
                  Chúng tôi gìn giữ kỹ thuật ủ hương cổ điển qua nhiều thế hệ, để mỗi tinh chất thực
                  vật vẫn giữ được cá tính nguyên bản và chiều sâu tự nhiên.
                </p>
              </div>

              <Link
                to="/blog"
                className="mt-8 inline-flex border border-[#CFC6AC] px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#856F20] transition hover:bg-[#856F20] hover:text-white"
              >
                Xem lưu trữ
              </Link>
            </div>

            <div className="relative mx-auto min-h-[470px] w-full max-w-[650px]">
              <div className="absolute right-0 top-0 h-[420px] w-[72%] overflow-hidden shadow-[0_22px_45px_rgba(0,0,0,0.13)]">
                <img
                  loading="lazy"
                  src="https://res.cloudinary.com/dwj2trmn0/image/upload/v1784433419/Screenshot_2026-07-19_105646_sbbhq0.png"
                  alt="Phòng chế tác nước hoa"
                  className="h-full w-full object-cover grayscale"
                />
              </div>

              <div className="absolute bottom-0 left-0 z-10 w-[48%] border-[10px] border-[#F7F4EF] bg-[#F7F4EF] shadow-sm">
                <img
                  loading="lazy"
                  src="https://res.cloudinary.com/dwj2trmn0/image/upload/t_j/images_3_ypjabi.jpg"
                  alt="Đôi tay nâng một bông hoa"
                  className="aspect-[4/5] w-full object-cover grayscale"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nghệ nhân điều hương */}
        <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1080px] items-center gap-12 lg:grid-cols-2">
            <div className="relative">
              <img
                loading="lazy"
                src="https://res.cloudinary.com/dwj2trmn0/image/upload/v1784433506/Senza_titolo-14_1024x1024_gkqyw6.webp"
                alt="Nghệ nhân điều hương"
                className="aspect-[1.05/1] w-full object-cover grayscale"
              />
            </div>

            <div>
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#8F7A2D]">
                Người nghệ nhân
              </p>

              <h2
                className="text-[48px] leading-[1.05] tracking-[-0.03em] lg:text-[58px]"
                style={{ fontFamily: "'Noto Serif', 'Noto Serif Display', serif" }}
              >
                Làm chủ
                <br />
                khoảng lặng hương
              </h2>

              <blockquote className="mt-7 max-w-[570px] text-lg leading-7 text-[#55524D]">
                “Tôi không tạo ra mùi. Tôi sắp đặt những bóng hình ký ức chưa từng xảy ra.”
                <span className="ml-2 text-sm">— Elias Thorne</span>
              </blockquote>

              <div className="mt-7 max-w-[570px] space-y-5 text-sm leading-6 text-[#706D66]">
                <p>
                  Elias Thorne, nghệ nhân điều hương chính, xem mùi hương như kiến trúc. Phương pháp
                  của ông bắt đầu bằng một khoảng lặng cảm giác trước khi phác thảo công thức mới.
                </p>

                <p>
                  Với hơn ba thập kỷ sáng tạo, Thorne tái định nghĩa sự xa xỉ hiện đại bằng cách đưa
                  những loại nhựa thơm bị lãng quên và hoa quý trở lại bảng hương đương đại.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bảng nguyên liệu */}
        <section className="bg-[#F5F2ED] px-4 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[1460px]">
            <h2 className="mb-9 pl-0 text-sm uppercase tracking-[0.18em] text-[#554F47] lg:pl-[16%]">
              Bảng nguyên liệu thô
            </h2>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5 lg:gap-8">
              {rawPaletteItems.map((ingredient) => (
                <Link
                  key={ingredient.name}
                  to={ingredient.to}
                  className="group overflow-hidden bg-[#EEEAE4]"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      loading="lazy"
                      src={ingredient.image}
                      alt={ingredient.name}
                      className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  </div>

                  <div className="px-4 py-4">
                    <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-[#57534C]">
                      {ingredient.name}
                    </p>

                    <p className="mt-2 text-[8px] uppercase tracking-[0.14em] text-[#9B8125]">
                      {ingredient.caption}
                    </p>

                    <span className="mt-4 inline-flex border-b border-[#AB9851] pb-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-[#675711]">
                      Xem mùi hương
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bền vững */}
        <section className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-[980px] gap-12 bg-[#E9E6E1] p-8 sm:p-12 lg:grid-cols-[1.05fr_0.95fr] lg:p-16">
            <div className="self-center">
              <h2
                className="text-4xl tracking-[-0.025em] lg:text-[48px]"
                style={{ fontFamily: "'Noto Serif', 'Noto Serif Display', serif" }}
              >
                Xa xỉ bền vững
              </h2>

              <p className="mt-5 max-w-[470px] text-sm leading-6 text-[#66635C]">
                Sự xa xỉ đích thực luôn bền vững từ bản chất. Nó đòi hỏi sự xuất sắc, và sự xuất sắc
                cần được nuôi dưỡng bằng việc bảo tồn hệ sinh thái tạo nên nguyên liệu quý.
              </p>

              <div className="mt-8 space-y-7">
                <div className="flex gap-4">
                  <Leaf size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-[#8A731A]" />

                  <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                      Chính sách không nhựa
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#6A675F]">
                      Mọi thành phần bao bì đều có thể phân hủy sinh học hoặc tái chế lâu dài.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Droplets size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-[#8A731A]" />

                  <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                      Thu hoạch có đạo đức
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#6A675F]">
                      Chúng tôi làm việc trực tiếp với nông hộ địa phương để bảo vệ đa dạng sinh học
                      và đảm bảo thù lao công bằng.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid min-h-[390px] grid-cols-2 gap-3">
              <img
                loading="lazy"
                src="https://res.cloudinary.com/dwj2trmn0/image/upload/v1784434666/images_6_okorl3.jpg"
                alt="Giọt tinh dầu nước hoa"
                className="h-full w-full object-cover grayscale"
              />

              <div className="grid grid-rows-2 gap-3">
                <img
                  loading="lazy"
                  src="https://res.cloudinary.com/dwj2trmn0/image/upload/v1784434665/images_7_mcvnoy.jpg"
                  alt="Bề mặt tối giản màu trắng"
                  className="h-full w-full object-cover grayscale"
                />

                <img
                  loading="lazy"
                  src="https://res.cloudinary.com/dwj2trmn0/image/upload/v1784434665/images_8_su7gzr.jpg"
                  alt="Cảnh quan thiên nhiên"
                  className="h-full w-full object-cover grayscale"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bản đồ cửa hàng */}
        <AboutStoreMap />

        {/* Chính sách */}
        <section className="bg-[#F2EFEA] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-12 max-w-[620px]">
              <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#927A20]">
                Chăm sóc khách hàng
              </p>

              <h2
                className="text-4xl tracking-[-0.025em] lg:text-[52px]"
                style={{ fontFamily: "'Noto Serif', 'Noto Serif Display', serif" }}
              >
                Thông tin & Chính sách
              </h2>

              <p className="mt-5 text-sm leading-6 text-[#69665F]">
                Những thông tin cần thiết trước và sau khi mua hàng, được trình bày ngắn gọn để
                khách hàng dễ tra cứu.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {policySections.map((item) => (
                <article
                  key={item.id}
                  id={item.id}
                  className="scroll-mt-28 border border-[#DED5C7] bg-[#FCF9F4] p-7"
                >
                  <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#927A20]">
                    {item.label}
                  </p>

                  <h3
                    className="mt-4 text-[26px] leading-tight"
                    style={{ fontFamily: "'Noto Serif', 'Noto Serif Display', serif" }}
                  >
                    {item.title}
                  </h3>

                  <p className="mt-4 text-xs leading-6 text-[#6B6861]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bản tin */}
        <section className="px-6 pb-28 pt-10 text-center sm:px-10 lg:pb-36">
          <h2
            className="text-4xl tracking-[-0.025em]"
            style={{ fontFamily: "'Noto Serif', 'Noto Serif Display', serif" }}
          >
            Tham gia bản tin biên tập
          </h2>

          <p className="mt-4 text-sm text-[#77736C]">
            Nhận chuyên san định kỳ về mùi hương, nghệ thuật và những điều vô hình.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="mx-auto mt-9 flex max-w-[390px] items-center border-b border-[#D4CBB5]"
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ĐỊA CHỈ EMAIL CỦA BẠN"
              className="min-w-0 flex-1 bg-transparent py-4 text-[9px] uppercase tracking-[0.16em] outline-none placeholder:text-[#AAA69D]"
            />

            <button
              type="submit"
              disabled={subscribing}
              aria-label="Đăng ký"
              className="px-2 text-[#927A20] transition hover:translate-x-1 disabled:cursor-wait disabled:opacity-50"
            >
              <ArrowRight size={18} strokeWidth={1.3} />
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
