import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
export default function Footer() {

return (

<footer className="bg-white pt-20">

<div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 pb-20">

<div>

<div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center font-bold mb-6">
LOGO
</div>

<h3 className="font-serif text-2xl mb-5">
Perfume Store
</h3>

<p className="text-gray-500 leading-8">
Chuyên cung cấp nước hoa chính hãng,
đa dạng thương hiệu nổi tiếng trên thế giới.
</p>

<div className="flex gap-5 mt-8">

  <FaFacebookF size={20} />

  <FaInstagram size={20} />

  <FaYoutube size={20} />

</div>

</div>

<div>

<h3 className="font-serif text-2xl mb-6">
Danh mục
</h3>

<ul className="space-y-4 text-gray-500">

<li>Trang chủ</li>

<li>Sản phẩm</li>

<li>Thương hiệu</li>

<li>Tin tức</li>

<li>Giới thiệu</li>

</ul>

</div>

<div>

<h3 className="font-serif text-2xl mb-6">
Hỗ trợ
</h3>

<ul className="space-y-4 text-gray-500">

<li>Chính sách đổi trả</li>

<li>Thanh toán</li>

<li>Vận chuyển</li>

<li>Bảo hành</li>

<li>Liên hệ</li>

</ul>

</div>

<div>

<h3 className="font-serif text-2xl mb-6">
Liên hệ
</h3>

<div className="space-y-5 text-gray-500">

<div className="flex gap-3">

<MapPin size={18}/>

<span>Vĩnh Long</span>

</div>

<div className="flex gap-3">

<Phone size={18}/>

<span>0328 779 845</span>

</div>

<div className="flex gap-3">

<Mail size={18}/>

<span>contact4w@perfume.vn</span>

</div>

</div>

</div>

</div>

<div className="border-t">
  <div className="max-w-7xl mx-auto py-8 text-center text-sm text-gray-500">
    <p>
      © 2026 Perfume Store. All Rights Reserved.
    </p>
  </div>
</div>

</footer>

)

}