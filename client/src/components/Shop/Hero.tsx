interface HeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

export default function Hero({
  title = "The Seasonal Archives",
  subtitle = "A curated selection of olfactory experiences. From the smoky woods of the East to the clean citrus palettes of the Mediterranean.",
  image = "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200",
}: HeroProps) {
  return (
    <section className="max-w-[1536px] mx-auto px-6 lg:px-10 pt-24 pb-16">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <h1 className="font-heading text-5xl lg:text-7xl xl:text-[88px] leading-none text-[#1C1C19]">
            {title.split(" ")[0]} {title.split(" ")[1]}
            <br />
            {title.split(" ").slice(2).join(" ")}
          </h1>

<<<<<<< HEAD
          <p className="mt-8 max-w-md text-[#666] leading-8">
            {subtitle}
          </p>
        </div>

        <div className="overflow-hidden bg-[#F3EEE7] aspect-[16/9]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
=======
          <p className="mt-8 max-w-md text-[#666] leading-8">{subtitle}</p>
        </div>

        <div className="overflow-hidden bg-[#F3EEE7] aspect-[16/9]">
          <img src={image} alt={title} className="w-full h-full object-cover" />
>>>>>>> feature/pf-32-category-brand-crud
        </div>
      </div>
    </section>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> feature/pf-32-category-brand-crud
