import { Phone, Mail, MapPin } from "lucide-react";

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F4] px-5 pt-12 font-['Manrope'] sm:px-8 lg:pt-20">
      <div className="mx-auto grid max-w-7xl gap-10 pb-12 sm:grid-cols-2 md:grid-cols-4 lg:gap-12 lg:pb-20">
        <div>
          <div className="w-16 h-16 rounded-full bg-black border-4 border-white shadow-lg text-white flex items-center justify-center font-['Noto_Serif'] font-bold tracking-[1.8px] mb-6">
            LOGO
          </div>

          <h3 className="font-['Noto_Serif'] font-bold text-xl text-[#1C1917] mb-5">
            Perfume Store
          </h3>

          <p className="text-[#78716C] text-xs leading-5 tracking-[0.3px]">
            Chuyên cung cấp nước hoa chính hãng, đa dạng thương hiệu nổi tiếng
            trên thế giới.
          </p>

          <div className="flex gap-4 mt-8 text-[#A8A29E]">
            <FaFacebookF size={18} />
            <FaInstagram size={18} />
            <FaYoutube size={18} />
          </div>
        </div>

        <div>
          <h3 className="font-['Noto_Serif'] font-bold text-sm uppercase tracking-[1.4px] text-[#1C1917] mb-6">
            Danh mục
          </h3>

          <ul className="space-y-4 text-[#78716C] text-xs tracking-[0.3px]">
            <li>Trang chủ</li>
            <li>Sản phẩm</li>
            <li>Thương hiệu</li>
            <li>Tin tức</li>
            <li>Giới thiệu</li>
          </ul>
        </div>

        <div>
          <h3 className="font-['Noto_Serif'] font-bold text-sm uppercase tracking-[1.4px] text-[#1C1917] mb-6">
            Hỗ trợ
          </h3>

          <ul className="space-y-4 text-[#78716C] text-xs tracking-[0.3px]">
            <li>Chính sách đổi trả</li>
            <li>Thanh toán</li>
            <li>Vận chuyển</li>
            <li>Bảo hành</li>
            <li>Liên hệ</li>
          </ul>
        </div>

        <div>
          <h3 className="font-['Noto_Serif'] font-bold text-sm uppercase tracking-[1.4px] text-[#1C1917] mb-6">
            Liên hệ
          </h3>

          <div className="space-y-5 text-[#78716C] text-xs tracking-[0.3px]">
            <div className="flex gap-3">
              <MapPin size={16} className="text-[#735C00] shrink-0" />
              <span>Vĩnh Long</span>
            </div>

            <div className="flex gap-3">
              <Phone size={16} className="text-[#735C00] shrink-0" />
              <span>0328 779 845</span>
            </div>

            <div className="flex gap-3">
              <Mail size={16} className="text-[#735C00] shrink-0" />
              <span>contact4w@perfume.vn</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto py-8 text-center text-xs text-[#78716C] tracking-[0.3px]">
          <p>© 2026 Perfume Store. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
