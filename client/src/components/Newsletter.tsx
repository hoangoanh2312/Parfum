import { FormEvent, useState } from "react";
import { toast } from "../store/toast.store";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Email không hợp lệ");
      return;
    }

    toast.success("Đã đăng ký nhận tin");
    setEmail("");
  };

  return (
    <section className="border-t border-[#EEEAE2] bg-[#F8F5F0] px-5 py-20 md:px-10 lg:py-24">
      <div className="mx-auto max-w-[760px] text-center">
        <p className="text-[9px] uppercase tracking-[0.38em] text-[#77736C]">
          The inner circle
        </p>

        <h2 className="mt-5 font-serif text-4xl font-semibold text-[#1D1C19] md:text-5xl">
          Join the Editorial
        </h2>

        <p className="mx-auto mt-5 max-w-[650px] text-sm leading-6 text-[#706C65]">
          Receive curated insights into the intersection of olfactory art,
          seasonal narratives, and exclusive early access to our limited
          botanical extractions.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-9 flex max-w-[550px] flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            className="h-[52px] min-w-0 flex-1 border border-[#D8D2C8] bg-transparent px-4 text-sm outline-none placeholder:text-[#A19C94] focus:border-[#817000]"
          />

          <button
            type="submit"
            className="h-[52px] bg-[#817000] px-10 text-[10px] uppercase tracking-[0.08em] text-white transition hover:bg-[#665800]"
          >
            Subscribe
          </button>
        </form>

        <p className="mt-3 text-[7px] uppercase tracking-[0.11em] text-[#AAA59E]">
          By subscribing, you agree to our privacy policy and terms of service.
        </p>
      </div>
    </section>
  );
}
