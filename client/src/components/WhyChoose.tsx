import {
  FlaskConical,
  Leaf,
  LibraryBig,
  WandSparkles,
} from "lucide-react";

const reasons = [
  {
    id: 1,
    icon: WandSparkles,
    title: "Artisanal Craftsmanship",
    description:
      "Every vessel is a masterpiece. Our collections feature hand-poured bottles and utilize traditional distillation methods passed down through generations of master perfumers.",
  },
  {
    id: 2,
    icon: FlaskConical,
    title: "Rare Ingredients",
    description:
      "We scour the globe for the impossible. Our laboratory unites the finest natural absolutes with groundbreaking synthetics to create olfactory silhouettes that endure.",
  },
  {
    id: 3,
    icon: LibraryBig,
    title: "Curated Experience",
    description:
      "Beyond a scent, we offer a narrative. Our editorial approach ensures a deeply personal journey in finding the fragrance that resonates with your unique identity.",
  },
  {
    id: 4,
    icon: Leaf,
    title: "Sustainability",
    description:
      "Luxury with a conscience. We are committed to cruelty-free practices and ethically sourced materials, ensuring the preservation of the botanicals we cherish.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#FCF9F4] px-5 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.38em] text-[#77736C]">
            The editorial standard
          </p>

          <h2 className="mt-5 font-serif text-4xl font-semibold text-[#1D1C19] md:text-5xl">
            Why Choose Us
          </h2>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <article key={reason.id}>
                <div className="flex h-9 w-9 items-center justify-center border border-[#E1DDD5]">
                  <Icon size={16} strokeWidth={1.4} />
                </div>

                <h3 className="mt-6 max-w-[200px] font-serif text-xl font-semibold leading-tight text-[#2A2824]">
                  {reason.title}
                </h3>

                <p className="mt-4 text-[13px] leading-6 text-[#716D66]">
                  {reason.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}