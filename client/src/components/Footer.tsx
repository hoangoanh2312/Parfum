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

const PAYMENTS = ["VISA", "Mastercard", "COD", "VietQR"];
const PROMO_IMAGE =
  "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784435350/view-all-fragrances-banner-mobile_3884d600-2ada-4144-a0f8-18bd647896a9_nxmh16.webp";

export default function Footer() {
  return (
    <footer
      className="border-t border-white/[0.06] bg-[#161412] text-[#8A8580]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-9 py-10 lg:grid-cols-[300px_1fr] lg:gap-12 lg:py-14">
          <Link
            to="/shop"
            className="group relative hidden min-h-[340px] overflow-hidden rounded-md lg:block"
          >
            <img
              src={PROMO_IMAGE}
              alt="L'Essence Noire fragrance collection"
              className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-700 group-hover:scale-105 group-hover:opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-7">
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

          <div className="flex flex-col">
            <div className="mb-9">
              <Link
                to="/"
                className="inline-flex text-[15px] font-semibold uppercase tracking-[0.22em] text-white"
                style={{ fontFamily: "'Spectral', 'Noto Serif', serif" }}
              >
                L&apos;Essence Noire
              </Link>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#8A8580]">
                Nước hoa chính hãng, tuyển chọn theo cá tính mùi hương và trải
                nghiệm mua sắm tinh gọn.
              </p>
            </div>

            <nav className="grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-3">
              {FOOTER_LINKS.map((col) => (
                <div key={col.heading}>
                  <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                    {col.heading}
                  </p>
                  <ul className="space-y-3">
                    {col.links.map((link) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="text-sm leading-none text-[#8A8580] transition hover:text-white"
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

      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#5C5650]">
              © 2026 L&apos;Essence Noire. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {PAYMENTS.map((label) => (
                <span
                  key={label}
                  className="border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5C5650]"
                >
                  {label}
                </span>
              ))}
              <Link
                to="/admin"
                className="ml-0 border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#75621E] transition hover:border-[#75621E] hover:text-[#D8CBB7] sm:ml-2"
              >
                Quản trị
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
