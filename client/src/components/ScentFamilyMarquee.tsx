import { useEffect, useRef } from "react";

type ScentFamily = {
  name: string;
  image: string;
  description: string;
};

// Nhom mui huong + anh dai dien + mo ta ngan (1-2 cau).
const SCENT_FAMILIES: ScentFamily[] = [
  {
    name: "Floral",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcUyeP2qsr7K8Kgg9ndO326Ks5hRCbG-8kowKssfbUKg&s=10?w=900&q=80",
    description:
      "Những cánh hoa hồng, nhài và dành dành hé nở lúc bình minh — thanh lịch, nữ tính và đầy lãng mạn.",
  },
  {
    name: "Woody",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYxsQg2lzuPyKUOFk6C58zYBQENvX-8qwMXkpOIVeGEA&s=10?w=900&q=80",
    description:
      "Cốt gỗ đàn hương, tuyết tùng và trầm hương sâu lắng, kiến tạo chiều sâu ấm và vững chãi.",
  },
  {
    name: "Oriental",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1SdGabYja-p6Q6_FrgmOk5hNrgd1uD80iCYQo-QRGWg&s=10?w=900&q=80",
    description:
      "Hổ phách, vanilla và gia vị ấm dệt nên tầng hương huyền bí, quyến rũ và sang trọng.",
  },
  {
    name: "Citrus",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmDCFd7Zn7yuqEgc5CI_eBhhvJmK7mg0VTJaOFwr2bog&s=10?w=900&q=80",
    description:
      "Bergamot, chanh và cam tươi bật tỏa năng lượng rạng rỡ, sảng khoái ngay từ nhịp đầu tiên.",
  },
  {
    name: "Fresh",
    image:
      "https://apaniche.vn/wp-content/webp-express/webp-images/uploads/2025/09/mui-huong-tuoi-moi.png.webp?w=900&q=80",
    description:
      "Hương biển, lá xanh và không khí núi cao mang lại cảm giác sạch, thoáng và tràn đầy sức sống.",
  },
  {
    name: "Aromatic",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_zquUzhIzdUYO-j8PWlDrbSPjWBmZod1wdei_lV3Bzw&s=10?w=900&q=80",
    description:
      "Oải hương, hương thảo và xô thơm gợi nên nét phong trần, lịch lãm và cân bằng.",
  },
  {
    name: "Leather",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCe5JzyIg_5Z5eV1_Vmw0OQe2HWA-pS5pJznj4AdMmIQ&s=10?w=900&q=80",
    description:
      "Da thuộc và khói gợi cảm giác cổ điển, mạnh mẽ — dấu ấn cá tính không thể nhầm lẫn.",
  },
  {
    name: "Gourmand",
    image:
      "https://nuochoamc.com/upload/images/bai-viet/421/nuoc-hoa-mui-huong-banh-keo-gourmand-la-gi.webp?w=900&q=80",
    description:
      "Vanilla, caramel và cacao ngọt ngào như một món tráng miệng — ấm áp và đầy mời gọi.",
  },
];

/**
 * Dai card nhom mui huong:
 * - Khi de yen: tu dong luot sang trai (marquee lien tuc, lap vo tan).
 * - Khi con tro trong vung card + lan chuot len/xuong: cuon sang phai/trai theo huong lan.
 */
export default function ScentFamilyMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);

  // Nhan doi danh sach de tao vong lap lien mach.
  const loopFamilies = [...SCENT_FAMILIES, ...SCENT_FAMILIES];

  // Auto-scroll bang requestAnimationFrame.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const SPEED = 0.5; // px moi frame

    const step = () => {
      if (!hoveringRef.current) {
        track.scrollLeft += SPEED;
        // Nua sau la ban sao -> reset ve dau khi qua nua de lap vo tan.
        const half = track.scrollWidth / 2;
        if (track.scrollLeft >= half) track.scrollLeft -= half;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Lan chuot doc -> cuon ngang theo huong lan.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (event.deltaY === 0) return;
      event.preventDefault();
      track.scrollLeft += event.deltaY * 1.5;
      const half = track.scrollWidth / 2;
      if (track.scrollLeft >= half) track.scrollLeft -= half;
      else if (track.scrollLeft < 0) track.scrollLeft += half;
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section className="border-t border-[#E6E1D9] bg-[#F4F1EB] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-3 text-[10px] uppercase tracking-[0.28em] text-[#9B8125]">
          The Fragrance Wheel
        </div>
        <h2
          className="max-w-[620px] text-[38px] leading-[1.05] tracking-[-0.03em] sm:text-[48px]"
          style={{ fontFamily: "'Spectral', serif" }}
        >
          Tất cả nhóm mùi hương
        </h2>
        <p className="mt-4 max-w-[560px] text-sm leading-7 text-[#69665F]">
          Khám phá toàn bộ các họ hương làm nên bản đồ khứu giác của chúng tôi.
          Di chuột vào dải thẻ và lăn lên – xuống để duyệt qua từng nhóm hương.
        </p>
      </div>

      <div
        ref={trackRef}
        onMouseEnter={() => (hoveringRef.current = true)}
        onMouseLeave={() => (hoveringRef.current = false)}
        className="mt-10 flex gap-6 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loopFamilies.map((family, index) => (
          <article
            key={`${family.name}-${index}`}
            className="group relative w-[280px] shrink-0 sm:w-[320px]"
          >
            <div className="overflow-hidden bg-[#E4DFD8]">
              <img
                src={family.image}
                alt={family.name}
                loading="lazy"
                className="aspect-[0.82/1] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
              />
            </div>
            <h3
              className="mt-5 text-[24px] leading-tight tracking-[-0.01em]"
              style={{ fontFamily: "'Spectral', serif" }}
            >
              {family.name}
            </h3>
            <p className="mt-2 text-xs leading-5 text-[#6E6A63]">
              {family.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
