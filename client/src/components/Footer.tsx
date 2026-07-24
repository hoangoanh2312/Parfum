import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  {
    heading: "Mua sắm",
    links: [
      { label: "Trang chủ", to: "/" },
      { label: "Sản phẩm", to: "/shop" },
      { label: "Thương hiệu", to: "/brand" },
      { label: "Giỏ hàng", to: "/cart" },
    ],
  },
  {
    heading: "Tài khoản",
    links: [
      { label: "Đăng nhập", to: "/login" },
      { label: "Đăng ký", to: "/register" },
      { label: "Đơn hàng của tôi", to: "/account/orders" },
      { label: "Sổ địa chỉ", to: "/account/addresses" },
      { label: "Wishlist", to: "/account/wishlist" },
    ],
  },
  {
    heading: "Hỗ trợ",
    links: [
      { label: "Tra cứu đơn hàng", to: "/order-lookup" },
      { label: "Liên hệ", to: "/contact" },
      { label: "Chính sách bảo mật", to: "/privacy-policy" },
      { label: "Giới thiệu", to: "/about" },
      { label: "Journal", to: "/blog" },
    ],
  },
];

const PROMO_IMAGE =
  "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784435350/view-all-fragrances-banner-mobile_3884d600-2ada-4144-a0f8-18bd647896a9_nxmh16.webp";

export default function Footer() {
  return (
    <footer
      className="border-t border-white/[0.06] bg-[#161412] text-[#8A8580]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-10 2xl:px-2.5">
        <div className="grid gap-10 py-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start lg:gap-14 lg:py-16 2xl:grid-cols-12 2xl:gap-x-8">
          <Link
            to="/shop"
            className="group relative hidden min-h-[420px] overflow-hidden border border-white/[0.08] lg:block 2xl:col-span-3 2xl:col-start-3"
          >
            <img
              loading="lazy"
              src={PROMO_IMAGE}
              alt="L'Essence Noire fragrance collection"
              className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/45" />

            <div className="absolute inset-x-0 top-0 p-7">
              <span
                className="text-[14px] font-semibold uppercase tracking-[0.22em] text-white"
                style={{ fontFamily: "'Spectral', 'Noto Serif', serif" }}
              >
                L&apos;Essence Noire
              </span>
              <span className="mt-3 block h-px w-10 bg-[#C9A84C]/70" />
            </div>

            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#D8CBB7]">
                Signature Collection
              </p>
              <h3
                className="mt-3 text-[25px] font-bold leading-[1.12] text-white"
                style={{ fontFamily: "'Spectral', 'Noto Serif', serif" }}
              >
                Find Your
                <br />
                Next Scent
              </h3>
              <span className="mt-6 inline-flex w-full justify-center border border-[#D9D2C4] bg-[#EDE8DF] py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#735C00] transition group-hover:bg-white">
                Khám phá ngay
              </span>
            </div>
          </Link>

          <div className="lg:pt-7 2xl:col-span-7 2xl:col-start-6">
            <div className="mb-10 lg:hidden">
              <Link
                to="/"
                className="inline-flex text-[15px] font-semibold uppercase tracking-[0.22em] text-white"
                style={{ fontFamily: "'Spectral', 'Noto Serif', serif" }}
              >
                L&apos;Essence Noire
              </Link>
              <p className="mt-4 max-w-[380px] text-sm leading-7 text-[#8A8580]">
                Nước hoa chính hãng, tuyển chọn theo cá tính mùi hương và trải nghiệm mua sắm tinh
                gọn.
              </p>
            </div>

            <nav className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 sm:gap-x-12">
              {FOOTER_LINKS.map((col) => (
                <div key={col.heading}>
                  <p className="mb-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">
                    <span className="h-1 w-1 rounded-full bg-[#C9A84C]" />
                    {col.heading}
                  </p>
                  <ul className="space-y-3.5">
                    {col.links.map((link) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="group/link inline-flex items-center gap-2 text-sm leading-none text-[#8A8580] transition duration-200 hover:translate-x-1 hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06]" />

      <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-10 2xl:px-2.5">
        <div className="flex flex-col items-center gap-2 py-6 sm:flex-row sm:justify-between">
          <p className="text-xs tracking-wide text-[#5C5650]">
            © 2026 L&apos;Essence Noire. All rights reserved.
          </p>
          <p className="text-xs tracking-wide text-[#5C5650]">
            Thiết kế cho những mùi hương không thể nhầm lẫn.
          </p>
        </div>
      </div>
    </footer>
  );
}
