import {
  Heart,
  ShoppingBag,
  Sun,
  Moon,
  Quote,
  Share2,
  MessageSquare,
  AtSign,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useCart } from "../store/cart.store";
import { toast } from "../store/toast.store";

const PLACEHOLDER = "https://placehold.co/900x1100?text=No+Image";

type ProductVariant = {
  id: string;
  sku?: string;
  size: string;
  volume: string;
  price: number;
  priceText: string;
  stock: number;
  images?: string[];
  isActive?: boolean;
};

type ProductDetailData = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  fragranceFamily?: string;
  concentration?: string;
  gallery: string[];
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  variants: ProductVariant[];
  stock: number;
};

type ProductListItem = {
  id: string;
  slug?: string;
  name: string;
  brand?: string;
  category?: string;
  image?: string | null;
  images?: string[];
  price?: number | null;
  priceText?: string;
};

type ProductListResponse = {
  data: ProductListItem[];
};

const vnd = (value: number) => `${(value || 0).toLocaleString("vi-VN")}đ`;

export default function ProductDetail() {
  const { idOrSlug } = useParams();
  const addItem = useCart((state) => state.addItem);
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductListItem[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        const { data } = await api.get<ProductDetailData>(`/products/${idOrSlug}`);
        if (!active) return;

        const firstVariant =
          data.variants.find((variant) => variant.isActive !== false && variant.stock > 0) ||
          data.variants[0];

        setProduct(data);
        setSelectedVariantId(firstVariant?.id || "");
        setSelectedImage(data.gallery?.[0] || firstVariant?.images?.[0] || PLACEHOLDER);
        setError("");
      } catch (e: any) {
        if (!active) return;
        setError(e?.response?.data?.message || "Không tải được chi tiết sản phẩm");
      } finally {
        if (active) setLoading(false);
      }
    }

    if (idOrSlug) loadProduct();

    return () => {
      active = false;
    };
  }, [idOrSlug]);

  useEffect(() => {
    let active = true;

    api
      .get<ProductListResponse>("/products", { params: { limit: 4, sort: "newest" } })
      .then(({ data }) => {
        if (!active) return;
        setRelatedProducts(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => {
        if (active) setRelatedProducts([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedVariant = useMemo(
    () =>
      product?.variants.find((variant) => variant.id === selectedVariantId) ||
      product?.variants[0],
    [product, selectedVariantId],
  );

  const gallery = useMemo(() => {
    const variantImages = selectedVariant?.images || [];
    return Array.from(new Set([...(product?.gallery || []), ...variantImages])).filter(Boolean);
  }, [product, selectedVariant]);

  const currentImage = selectedImage || gallery[0] || PLACEHOLDER;
  const insetImage = gallery.find((image) => image !== currentImage) || currentImage;
  const availableStock = selectedVariant?.stock ?? 0;
  const canAdd = Boolean(selectedVariant?.id) && selectedVariant?.isActive !== false && availableStock > 0;

  const notes = [
    {
      icon: <Sun size={18} strokeWidth={1.4} />,
      title: "TOP NOTES",
      description: "The immediate impression. Effervescent and ethereal.",
      items: product?.notes.top || [],
    },
    {
      icon: <Heart size={17} strokeWidth={1.4} />,
      title: "HEART NOTES",
      description: "The soul of the fragrance. Full-bodied and radiant.",
      items: product?.notes.middle || [],
    },
    {
      icon: <Moon size={17} strokeWidth={1.4} />,
      title: "BASE NOTES",
      description: "The lasting memory. Rich, grounded, and sensual.",
      items: product?.notes.base || [],
    },
  ];

  async function handleAddToCart() {
    if (!product || !selectedVariant) return;

    if (!canAdd) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    try {
      await addItem(
        {
          variant: selectedVariant.id,
          product: product.id,
          name: product.name,
          slug: product.slug,
          image: currentImage === PLACEHOLDER ? null : currentImage,
          volume: selectedVariant.volume || selectedVariant.size,
          price: selectedVariant.price,
          stock: selectedVariant.stock,
          quantity: 1,
        },
        1,
      );
      toast.success("Đã thêm vào giỏ");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Không thể thêm vào giỏ");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf8f2] px-6 py-24 text-[#615e57]">
        <div className="mx-auto max-w-[1240px]">Đang tải sản phẩm...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#fbf8f2] px-6 py-24 text-[#615e57]">
        <div className="mx-auto max-w-[1240px]">
          <Link to="/shop" className="text-[#8b7100] underline">
            Quay lại Shop
          </Link>
          <p className="mt-6 text-red-600">{error || "Không tìm thấy sản phẩm"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#292824]">

      <main>
        {/* Product Hero */}
        <section className="bg-[#fbf8f2]">
          <div className="mx-auto grid max-w-[1240px] gap-14 px-6 py-12 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-16">
            {/* Image */}
            <div className="relative min-h-[570px] bg-[#f5f1eb]">
              <img
                src={currentImage}
                alt={product.name}
                className="h-full min-h-[570px] w-full object-contain p-12"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />

              {gallery.length > 1 && (
                <button
                  onClick={() => setSelectedImage(insetImage)}
                  className="absolute -bottom-10 right-[-20px] hidden h-[205px] w-[205px] border-[3px] border-white bg-white shadow-sm md:block"
                >
                <img
                  src={insetImage}
                  alt={`${product.name} detail`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER;
                  }}
                />
                </button>
              )}
            </div>

            {/* Information */}
            <div className="flex flex-col justify-center py-6 lg:pl-2">
              <p className="mb-7 text-[8px] uppercase tracking-[1.5px] text-[#aaa69e]">
                {product.category || "Collections"}&nbsp;&nbsp;/&nbsp;&nbsp;{product.fragranceFamily || "Signature"}
              </p>

              <h1 className="font-serif text-[44px] leading-[1.05] tracking-[-1px] md:text-[58px]">
                {product.name}
              </h1>

              <p className="mt-3 font-serif text-[16px] text-[#8e8980]">
                {product.concentration || product.brand || "Eau de Parfum"}
              </p>

              <p className="mt-7 max-w-[475px] text-[13px] leading-[1.85] text-[#615e57]">
                {product.description || "Mùi hương tinh tế, sang trọng và phù hợp cho nhiều dịp sử dụng."}
              </p>

              <p className="mt-7 font-serif text-[23px] font-semibold text-[#927600]">
                {selectedVariant ? selectedVariant.priceText || vnd(selectedVariant.price) : "Liên hệ"}
              </p>

              {product.variants.length > 1 && (
                <div className="mt-5 flex max-w-[410px] flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const active = variant.id === selectedVariant?.id;
                    const disabled = variant.stock <= 0 || variant.isActive === false;

                    return (
                      <button
                        key={variant.id}
                        disabled={disabled}
                        onClick={() => {
                          setSelectedVariantId(variant.id);
                          if (variant.images?.[0]) setSelectedImage(variant.images[0]);
                        }}
                        className={`border px-4 py-2 text-[9px] font-semibold uppercase tracking-[1.4px] transition ${
                          active
                            ? "border-[#8b7100] bg-[#8b7100] text-white"
                            : "border-[#e7dfd1] text-[#615e57] hover:border-[#8b7100]"
                        } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                      >
                        {variant.size || variant.volume || "Default"}
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!canAdd}
                className="mt-6 flex h-[50px] w-full max-w-[410px] items-center justify-center gap-2 bg-[#8b7100] text-[10px] font-semibold uppercase tracking-[2px] text-white transition hover:bg-[#715c00] disabled:cursor-not-allowed disabled:bg-[#d6d3d1]"
              >
                <ShoppingBag size={14} />
                {canAdd ? "Add to bag" : "Sold out"}
              </button>

              <button className="mt-3 h-[48px] w-full max-w-[410px] border border-[#e7dfd1] bg-transparent text-[9px] font-semibold uppercase tracking-[1.8px] text-[#615e57]">
                Complimentary sample included
              </button>

              <div className="mt-16 grid max-w-[410px] grid-cols-2 gap-8 border-t border-[#ece5d8] pt-8">
                <div>
                  <p className="text-[7px] uppercase tracking-[1px] text-[#aaa59c]">
                    Concentration
                  </p>
                  <p className="mt-2 text-[11px]">{product.concentration || "Signature"}</p>
                </div>

                <div>
                  <p className="text-[7px] uppercase tracking-[1px] text-[#aaa59c]">
                    Stock
                  </p>
                  <p className="mt-2 text-[11px]">
                    {canAdd ? `${availableStock} available` : "Sold out"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Olfactory Pyramid */}
        <section className="mt-10 bg-[#efebe5] py-20">
          <div className="mx-auto max-w-[1240px] px-6 md:px-10 lg:px-14">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="font-serif text-[31px]">
                  The Olfactory Pyramid
                </h2>

                <p className="mt-4 max-w-[480px] text-[11px] leading-[1.65] text-[#77736b]">
                  The architecture of the scent evolves over eight hours,
                  shifting from crystalline brightness to a deep, resonant
                  warmth.
                </p>
              </div>

              <p className="text-[8px] font-semibold uppercase tracking-[3px] text-[#8b7100]">
                Notes composition
              </p>
            </div>

            <div className="mt-12 grid bg-[#fbf9f5] md:grid-cols-3">
              {notes.map((note, index) => (
                <article
                  key={note.title}
                  className={`px-9 py-10 md:px-10 ${
                    index !== notes.length - 1
                      ? "border-b border-[#ebe5da] md:border-b-0 md:border-r"
                      : ""
                  }`}
                >
                  <div className="flex h-36px w-36px h-9 w-9 items-center justify-center bg-[#efebe3] text-[#9a830e]">
                    {note.icon}
                  </div>

                  <h3 className="mt-7 font-serif text-[16px] tracking-[1px]">
                    {note.title}
                  </h3>

                  <p className="mt-4 max-w-[225px] text-[10px] leading-[1.6] text-[#77736d]">
                    {note.description}
                  </p>

                  <div className="mt-6 space-y-2">
                    {(note.items.length ? note.items : ["Đang cập nhật"]).map((item) => (
                      <p key={item} className="text-[10px] text-[#3c3a35]">
                        {item}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Related products */}
        <section className="bg-[#fbf8f2] py-24">
          <div className="mx-auto max-w-[1240px] px-6 md:px-10 lg:px-14">
            <h2 className="text-center font-serif text-[25px] italic">
              Complete the Ritual
            </h2>

            <div className="mt-14 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link key={item.id} to={`/products/${item.slug || item.id}`} className="group">
                  <div className="aspect-square overflow-hidden bg-[#f2eee7]">
                    <img
                      src={item.images?.[0] || item.image || PLACEHOLDER}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                    />
                  </div>

                  <p className="mt-5 text-[8px] uppercase text-[#969189]">
                    {item.category || item.brand || "Parfum"}
                  </p>

                  <h3 className="mt-2 font-serif text-[14px]">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-[11px] text-[#8b7100]">
                    {item.priceText || (item.price ? vnd(item.price) : "Liên hệ")}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="bg-[#e9e5df] py-24">
          <div className="mx-auto max-w-[1050px] px-6 md:px-10">
            <div className="text-center">
              <h2 className="font-serif text-[31px]">Voices of the Evening</h2>

              <div className="mt-3 flex items-center justify-center gap-1 text-[#8b7100]">
                <span className="tracking-[2px]">★★★★★</span>
                <span className="ml-1 text-[8px] font-semibold text-[#45433e]">
                  4.9 / 5.0
                </span>
              </div>
            </div>

            <div className="mt-14 grid gap-12 md:grid-cols-[1.15fr_0.85fr]">
              <article className="relative border-r-0 border-[#ded9d0] pr-0 md:border-r md:pr-14">
                <Quote
                  size={40}
                  strokeWidth={1}
                  className="absolute -left-7 -top-5 text-[#ded8ca]"
                />

                <p className="font-serif text-[21px] leading-[1.55]">
                  This is not a scent for the shy. It&apos;s heavy, cinematic,
                  and lasts until dawn. The jasmine is incredibly realistic,
                  like holding the flower in your palm.
                </p>

                <p className="mt-6 text-[8px] font-semibold uppercase tracking-[1.5px]">
                  — Elena V., Verified Collector
                </p>
              </article>

              <div className="space-y-8">
                <article className="border-b border-[#d9d4cb] pb-8">
                  <h3 className="font-serif text-[17px]">
                    Sublime complexity.
                  </h3>

                  <p className="mt-4 text-[9px] leading-[1.7] text-[#6e6a63]">
                    The way the patchouli grounds the sweetness of the jasmine
                    is masterful. It avoids being too &quot;heavy&quot; and
                    instead feels incredibly sophisticated and dark.
                  </p>

                  <p className="mt-4 text-[7px] uppercase tracking-[1px]">
                    — Marcus T.
                  </p>
                </article>

                <article>
                  <h3 className="font-serif text-[17px]">
                    A true masterpiece.
                  </h3>

                  <p className="mt-4 text-[9px] leading-[1.7] text-[#6e6a63]">
                    I have searched for years for a jasmine that doesn&apos;t
                    smell synthetic. This is it. Pure and unforgettable.
                  </p>

                  <p className="mt-4 text-[7px] uppercase tracking-[1px]">
                    — Julianne S.
                  </p>
                </article>
              </div>
            </div>

            <div className="mt-16 text-center">
              <button className="border-b border-[#a58d2d] pb-2 text-[8px] font-semibold uppercase tracking-[2px]">
                Read all 142 reviews
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#fbf8f2]">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-16 md:grid-cols-2 md:px-10 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1.2fr] lg:px-14">
          <div>
            <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-black text-[11px] text-white">
              LOGO
            </div>

            <h3 className="mt-6 font-serif text-[17px] font-semibold">
              The Olfactory Editorial
            </h3>

            <p className="mt-6 max-w-[250px] text-[9px] leading-[1.7] text-[#8c877f]">
              A curated archive of high-end scents and the stories they tell.
              Elevating the art of perfumery through editorial precision.
            </p>

            <div className="mt-5 flex gap-3 text-[#aaa59d]">
              <Share2 size={15} strokeWidth={1.4} />
              <MessageSquare size={15} strokeWidth={1.4} />
              <AtSign size={15} strokeWidth={1.4} />
            </div>
          </div>

          <FooterColumn
            title="NAVIGATION"
            links={["Our Story", "Shipping & Returns", "Privacy Policy", "Contact"]}
          />

          <FooterColumn
            title="COLLECTIONS"
            links={[
              "The Resin Archive",
              "Floral Monologues",
              "Citrus Studies",
              "Limited Editions",
            ]}
          />

          <div>
            <h4 className="text-[9px] font-semibold tracking-[1px]">
              NEWSLETTER
            </h4>

            <p className="mt-6 max-w-[260px] text-[9px] leading-[1.6] text-[#8b867e]">
              Join our list for exclusive releases and editorial insights.
            </p>

            <div className="mt-7 flex border-b border-[#d9d4cb] pb-3">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent text-[9px] outline-none placeholder:text-[#aaa59e]"
              />

              <button className="text-[14px]">→</button>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-4 border-t border-[#e4dfd6] px-6 py-7 text-[7px] uppercase tracking-[0.6px] text-[#99948c] md:flex-row md:px-10 lg:px-14">
          <p>© 2024 The Olfactory Editorial. All Rights Reserved.</p>

          <div className="flex gap-7">
            <span>Paris</span>
            <span>Grasse</span>
            <span>New York</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FooterColumnProps {
  title: string;
  links: string[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h4 className="text-[9px] font-semibold tracking-[1px]">{title}</h4>

      <div className="mt-6 space-y-4">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="block text-[9px] text-[#8b867e] transition hover:text-[#8b7100]"
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
