import { useState } from "react";
import { toast } from "../store/toast.store";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Email không hợp lệ");
      return;
    }

    toast.success("Đã đăng ký nhận tin");
    setEmail("");
  };

  return (
    <section className="bg-[#f8f5ef] py-24">

      <div className="max-w-3xl mx-auto text-center">

        <span className="uppercase tracking-[5px] text-gray-500">
          Đăng ký nhận ưu đãi
        </span>

<h2 className="font-serif text-6xl text-center leading-tight w-full">
  Nhận tin tức mới nhất
</h2>

        <p className="mt-6 text-gray-500 leading-8">
          Đăng ký email để nhận thông tin về sản phẩm mới,
          chương trình khuyến mãi và các bộ sưu tập độc quyền.
        </p>

        <form onSubmit={handleSubmit} className="flex mt-12 shadow-lg">

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Nhập email của bạn"
            className="flex-1 px-6 py-5 outline-none"
          />

          <button className="bg-black text-white px-10 uppercase tracking-[3px] hover:bg-yellow-700 duration-300">
            Đăng ký
          </button>

        </form>

      </div>

    </section>
  );
}
