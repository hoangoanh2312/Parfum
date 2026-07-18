<<<<<<< HEAD
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
=======
import { Heart, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
>>>>>>> feature/pf-32-category-brand-crud
import { useCart } from "../store/cart.store";
import { toast } from "../store/toast.store";

const PLACEHOLDER = "https://placehold.co/500x500?text=No+Image";

export interface ProductCardData {
  _id?: string;
  id: string;
  slug?: string;
  name: string;
  brand?: string;
<<<<<<< HEAD
  description?: string;
=======
  category?: string;
  description?: string;
  fragranceFamily?: string;
>>>>>>> feature/pf-32-category-brand-crud
  price?: number | null;
  priceText?: string;
  image?: string | null;
  images?: string[];
  variantId?: string | null;
  volume?: string;
  sizes?: string[];
  stock?: number;
  gender?: string; // female | male | unisex (lọc Shop)
}

<<<<<<< HEAD
export default function ProductCard({ item }: { item: ProductCardData }) {
  const addItem = useCart((s) => s.addItem);
  const detailPath = `/products/${item.slug || item.id}`;
=======
interface ProductCardProps {
  item: ProductCardData;
  liked?: boolean;
  onWishlist?: (id: string) => void;
}
>>>>>>> feature/pf-32-category-brand-crud

export default function ProductCard({
  item,
  liked = false,
  onWishlist,
}: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const productId = item.id || item._id || "";
  const sizeOptions = useMemo(
    () => Array.from(new Set([...(item.sizes || []), item.volume].filter(Boolean))) as string[],
    [item.sizes, item.volume],
  );
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const detailPath = `/products/${item.slug || productId}`;
  const image = item.images?.[0] || item.image || PLACEHOLDER;
  const category = item.fragranceFamily || item.category || item.brand || "Signature";
  const selectedSize = sizeOptions[selectedSizeIndex] || "Default";
  const price =
    item.priceText ||
    (item.price != null ? `${item.price.toLocaleString("vi-VN")}đ` : "Liên hệ");
  const outOfStock =
    !item.variantId || (typeof item.stock === "number" && item.stock <= 0);

<<<<<<< HEAD
  const image =
    item.images?.[0] ||
    item.image ||
    PLACEHOLDER;

  async function handleAdd() {
=======
  async function handleAddToCart() {
>>>>>>> feature/pf-32-category-brand-crud
    if (!item.variantId) {
      toast.error("Sản phẩm chưa có phiên bản để bán");
      return;
    }

    if (typeof item.stock === "number" && item.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    try {
      await addItem(
        {
          variant: item.variantId,
          product: productId,
          name: item.name,
          slug: item.slug,
          image,
          volume: selectedSize,
          price: item.price || 0,
          stock: item.stock,
          quantity: 1,
        },
        1,
      );
      toast.success("Đã thêm vào giỏ");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Không thể thêm vào giỏ");
    }
  }

  function handleCycleSize() {
    if (sizeOptions.length <= 1) return;
    setSelectedSizeIndex((current) => (current + 1) % sizeOptions.length);
  }

  return (
<<<<<<< HEAD
    <article className="group">
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F3EEE7] aspect-[4/5]">
        <img
          src={image}
          alt={item.name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
          }}
          className={
            "w-full h-full object-cover duration-500 group-hover:scale-105 " +
            (outOfStock ? "opacity-60 grayscale" : "")
          }
        />

        {outOfStock && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 uppercase tracking-widest">
            Hết hàng
          </span>
        )}

        {/* Wishlist */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-[#1C1C19] hover:text-white duration-300">
          <Heart size={18} />
        </button>

        {/* Add to cart */}
        <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 duration-300">
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="w-full h-14 bg-[#1C1C19] text-white uppercase tracking-[2px] text-xs flex items-center justify-center gap-2 hover:bg-[#735C00] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={16} />
            {outOfStock ? "Hết hàng" : "Add to cart"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6">
        <p className="uppercase tracking-[3px] text-[10px] text-[#735C00]">
          {item.brand || "Eau De Parfum"}
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-[#1C1C19]">
          {item.name}
        </h3>

        <p className="mt-3 text-sm text-[#5F5E5E] leading-7 line-clamp-2">
          {item.description || "Mùi hương tinh tế, sang trọng."}
        </p>

        <div className="flex items-center justify-between mt-6">
          <span className="text-2xl font-semibold text-[#1C1C19]">
            {item.priceText || (item.price ? `${(item.price || 0).toLocaleString("vi-VN")}đ` : "Liên hệ")}
          </span>

          <Link
            to={detailPath}
            className="uppercase tracking-[2px] text-[11px] font-semibold text-[#735C00] hover:underline"
          >
            View
          </Link>
        </div>
      </div>
=======
    <article className="group flex h-full min-h-[560px] w-full flex-col bg-[#FCF8F3] p-8">
      <Link
        to={detailPath}
        className="flex aspect-square shrink-0 items-center justify-center overflow-hidden bg-[#F8F8F8]"
      >
        <img
          src={image}
          alt={item.name}
          onError={(event) => {
            event.currentTarget.src = PLACEHOLDER;
          }}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-8">
        <p className="mb-3 h-[14px] truncate text-[10px] font-medium uppercase tracking-[0.28em] text-[#77736E]">
          {category}
        </p>

        <Link to={detailPath}>
          <h3
            className="h-[62px] overflow-hidden font-serif text-[26px] font-semibold uppercase leading-none text-[#1E1D1A]"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.name}
          </h3>
        </Link>

        <div className="mt-4 flex h-[30px] items-center justify-between gap-4">
          <p className="font-serif text-[16px] text-[#625E58] whitespace-nowrap">
            {price}
          </p>

          <button
            type="button"
            onClick={handleCycleSize}
            className="flex min-w-0 items-center gap-2 text-[14px] text-[#625E58] transition-colors hover:text-black"
            title={sizeOptions.length > 1 ? "Đổi dung tích" : "Dung tích"}
          >
            <span className="truncate">{selectedSize}</span>
            <ChevronDown size={15} strokeWidth={1.5} className="shrink-0" />
          </button>
        </div>

        <div className="mt-auto flex items-center gap-4 pt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="h-[50px] flex-1 rounded-[8px] border border-[#1E1D1A] bg-transparent text-[15px] font-medium uppercase text-[#1E1D1A] transition-all duration-300 hover:bg-[#1E1D1A] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            {outOfStock ? "Hết hàng" : "Add to cart"}
          </button>

          <button
            type="button"
            onClick={() => onWishlist?.(productId)}
            aria-label="Add to wishlist"
            className="flex h-[50px] w-[42px] items-center justify-center text-[#816500] transition-transform duration-200 hover:scale-110"
          >
            <Heart size={22} strokeWidth={1.6} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
>>>>>>> feature/pf-32-category-brand-crud
    </article>
  );
}
