export interface BrandItem {
  id: number | string;
  name: string;
  image: string;
  description: string;
  slug: string;
}

export const DEFAULT_BRANDS: BrandItem[] = [
  {
    id: 1,
    name: "Byredo",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430692/brad_byre_szxdbv.jpg",
    description:
      "Translating memories and emotions into products and experiences. A contemporary European luxury house founded in Stockholm.",
    slug: "byredo",
  },
  {
    id: 2,
    name: "Diptyque",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430690/b_dipt_t5g5ar.jpg",
    description:
      "A pioneer of the Parisian olfactory landscape, known for its singular elegance and the illustrative charm of Saint-Germain.",
    slug: "diptyque",
  },
  {
    id: 3,
    name: "Creed",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430689/b_creed_p839lw.jpg",
    description:
      "Over 250 years of royal heritage. Hand-crafted fragrances using the highest quality natural ingredients from across the globe.",
    slug: "creed",
  },
  {
    id: 4,
    name: "Tom Ford",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430692/b_tf_evpbf4.webp",
    description:
      "The pinnacle of modern glamour. Scented masterpieces that provoke and captivate with unapologetic luxury.",
    slug: "tom-ford",
  },
  {
    id: 5,
    name: "Le Labo",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430691/b_labo_lmzvhj.jpg",
    description:
      "Wabi-sabi philosophy in liquid form. Freshly hand-blended fragrances that celebrate the beauty of imperfection.",
    slug: "le-labo",
  },
  {
    id: 6,
    name: "Maison Francis Kurkdjian",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430691/b_maison_dxhpva.jpg",
    description:
      "A fragrance wardrobe designed with the precision of a master perfumer. Timeless classics for the modern spirit.",
    slug: "maison-francis-kurkdjian",
  },
  {
    id: 7,
    name: "Jo Malone London",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430695/Jo_Malone_London_ubfmxz.jpg",
    description:
      "Elegant British fragrances known for unexpected combinations, refined simplicity and the art of scent layering.",
    slug: "jo-malone",
  },
  {
    id: 8,
    name: "Maison Margiela",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430691/b_maison_dxhpva.jpg",
    description:
      "Familiar moments and forgotten memories transformed into evocative fragrances through the Replica collection.",
    slug: "maison-margiela",
  },
  {
    id: 9,
    name: "Amouage",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430688/Amouage_spmod3.jpg",
    description:
      "A high perfumery house combining the mystery of the Middle East with contemporary artistic expression.",
    slug: "amouage",
  },
  {
    id: 10,
    name: "Parfums de Marly",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430698/Parfums_de_Marly_fkoqcc.jpg",
    description:
      "French perfumery inspired by the splendour of the eighteenth century and the golden age of royal fragrance.",
    slug: "parfums-de-marly",
  },
  {
    id: 11,
    name: "Xerjoff",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430700/Xerjoff_co4wf7.jpg",
    description:
      "Italian craftsmanship, precious ingredients and refined artistry united in an exceptional fragrance collection.",
    slug: "xerjoff",
  },
  {
    id: 12,
    name: "Frederic Malle",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430693/Frederic_Malle_mhgmbs.jpg",
    description:
      "A publishing house for perfume, giving master perfumers complete freedom to create uncompromising compositions.",
    slug: "frederic-malle",
  },
  {
    id: 13,
    name: "Kilian Paris",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430695/Kilian_Paris_a9dk9o.jpg",
    description:
      "Bold, sensual and sophisticated fragrances presented as objects of desire and designed to last a lifetime.",
    slug: "kilian-paris",
  },
  {
    id: 14,
    name: "Penhaligon's",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430698/Penhaligon_s_v15kzt.jpg",
    description:
      "A British perfume house with a rich heritage, eccentric personality and a long tradition of storytelling.",
    slug: "penhaligons",
  },
  {
    id: 15,
    name: "Acqua di Parma",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430688/Acqua_di_Parma_b8v2t3.jpg",
    description:
      "Italian style, sunlight and effortless sophistication captured through timeless citrus-led creations.",
    slug: "acqua-di-parma",
  },
  {
    id: 16,
    name: "Nishane",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430697/Nishane_uizvzd.jpg",
    description:
      "An Istanbul-based niche perfume house celebrated for powerful, distinctive and culturally inspired compositions.",
    slug: "nishane",
  },
  {
    id: 17,
    name: "Initio Parfums Privés",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430694/Initio_Parfums_Priv%C3%A9s_fxmmxv.jpg",
    description:
      "Magnetic fragrances exploring the connection between scent, emotion, instinct and human attraction.",
    slug: "initio",
  },
  {
    id: 18,
    name: "Roja Parfums",
    image: "https://res.cloudinary.com/dwj2trmn0/image/upload/v1784430699/Roja_Parfums_qc8vk2.jpg",
    description:
      "Opulent British perfumery composed from rare materials and presented with uncompromising attention to detail.",
    slug: "roja-parfums",
  },
];
