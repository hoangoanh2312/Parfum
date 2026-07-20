import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok, FaPinterestP } from "react-icons/fa";

const NAV_COLS = [
  {
    heading: "Shop",
    links: ["Trang chủ", "Sản phẩm", "Thương hiệu", "Bộ sưu tập", "Mẫu thử", "Quà tặng", "Nhãn hàng", "Fragrance Notes"],
  },
  {
    heading: "L'Essence Noire",
    links: ["Giới thiệu", "Chương trình thành viên", "Tìm hương phù hợp", "Đánh giá", "Câu chuyện khách hàng", "Tuyển dụng"],
  },
  {
    heading: "Hỗ trợ",
    links: ["Trung tâm trợ giúp", "FAQ", "Vận chuyển & Giao hàng", "Theo dõi đơn hàng", "Đổi trả", "Liên hệ"],
  },
  {
    heading: "Hướng dẫn",
    links: ["Cách chọn nước hoa", "Phân biệt nồng độ", "Bảo quản nước hoa", "Nước hoa & mùa", "Tin tức", "Blog"],
  },
];

const SOCIALS = [
  { label: "Facebook", icon: FaFacebookF },
  { label: "Instagram", icon: FaInstagram },
  { label: "TikTok", icon: FaTiktok },
  { label: "Pinterest", icon: FaPinterestP },
];

const PAYMENTS = ["VISA", "MC", "G Pay", "Apple Pay", "PayPal"];

const PROMO_IMAGE =
  "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784435350/view-all-fragrances-banner-mobile_3884d600-2ada-4144-a0f8-18bd647896a9_nxmh16.webp";

export default function Footer() {
  return (
    <footer
      className="bg-[#161412] text-[#7A7671]"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* MAIN CONTENT — centered container */}
      <div className="mx-auto max-w-[1280px] px-8 lg:px-12">

        {/* TOP ROW: promo card LEFT + nav RIGHT */}
        <div className="grid gap-0 py-10 lg:grid-cols-[300px_1fr] lg:gap-12 lg:py-14">

          {/* LEFT — Promo card */}
          <div className="relative hidden overflow-hidden rounded-2xl lg:block" style={{ minHeight: 340 }}>
            <img
              src={PROMO_IMAGE}
              alt="L'Essence Noire"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-7">
              <h3
                className="text-[24px] font-bold leading-[1.18] text-white"
                style={{ fontFamily: "'Spectral', serif" }}
              >
                Wear Luxury.<br />Pay Less.
              </h3>
              <p className="mt-2.5 text-[12px] leading-[1.7] text-white/65">
                Chọn một mùi hương mới mỗi tháng. Trả tiền cho trải nghiệm, không phải cái hộp.
              </p>
              <Link
                to="/shop"
className="mt-6 block w-full rounded-md border border-[#D9D2C4] bg-[#EDE8DF] py-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#735C00] shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#B5A47A] hover:bg-[#E8E2D8] hover:text-[#8A8176] hover:shadow-md active:translate-y-0 active:scale-[0.98] active:shadow-sm"              >
                Dùng thử ngay
              </Link>
            </div>
          </div>

          {/* RIGHT — Logo + 4-col nav */}
          <div className="flex flex-col">
            {/* Logo */}
            <div className="mb-10">
              <span
                className="text-[14px] font-semibold uppercase tracking-[0.24em] text-white"
                style={{ fontFamily: "'Spectral', 'Noto Serif', serif" }}
              >
                L'Essence Noire
              </span>
            </div>

            {/* 4-col links */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              {NAV_COLS.map((col) => (
                <div key={col.heading}>
                  <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/80">
                    {col.heading}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-[12px] leading-none text-[#6A6661] transition-colors hover:text-white/75"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-white/[0.06]" />

      {/* BOTTOM BAR — Social + Payment */}
      <div className="mx-auto max-w-[1280px] px-8 lg:px-12">
        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">

          {/* Social icons */}
          <div className="flex items-center gap-2.5">
            <span className="mr-1 text-[9px] uppercase tracking-[0.2em] text-[#48433E]">
              Follow us
            </span>
            {SOCIALS.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white/[0.07] text-[#7A7671] transition hover:bg-white/[0.13] hover:text-white"
              >
                <Icon size={12} />
              </a>
            ))}
          </div>

          {/* Payment badges */}
          <div className="flex items-center gap-1.5">
            {PAYMENTS.map((label) => (
              <span
                key={label}
                className="rounded border border-[#2e2b28] px-2 py-[3px] text-[9px] font-bold tracking-wide text-[#48433E]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-white/[0.06]" />

      {/* COPYRIGHT BAR */}
      <div className="mx-auto max-w-[1280px] px-8 lg:px-12">
        <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[#3E3A36]">
            © 2026 L'Essence Noire. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Điều khoản sử dụng", "Chính sách bảo mật", "Sitemap"].map((t) => (
              <a
                key={t}
                href="#"
                className="text-[11px] text-[#3E3A36] transition hover:text-[#6A6661]"
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}