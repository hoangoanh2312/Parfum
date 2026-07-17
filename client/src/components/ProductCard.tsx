import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../store/cart.store";
import { toast } from "../store/toast.store";

const PLACEHOLDER = "https://placehold.co/400x500?text=No+Image";

export interface ProductCardData {
  id: string;
  slug?: string;
  name: string;
  brand?: string;
  description?: string;
  price?: number | null;
  priceText?: string;
  image?: string | null;
  images?: string[];
  variantId?: string | null;
  volume?: string;
  stock?: number;
  gender?: string; // female | male | unisex (lọc Shop)
}

export default function ProductCard({ item }: { item: ProductCardData }) {
  const addItem = useCart((s) => s.addItem);
  const detailPath = `/products/${item.slug || item.id}`;

  // Hết hàng khi: chưa có phiên bản để bán HOẶC tổng tồn kho <= 0
  const outOfStock =
    !item.variantId || (typeof item.stock === "number" && item.stock <= 0);

  const image =
    item.images?.[0] ||
    item.image ||
    PLACEHOLDER;

  async function handleAdd() {
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
          name: item.name,
          image: item.image || undefined,
          volume: item.volume,
          price: item.price || 0,
          stock: item.stock,
          quantity: 1,
        },
        1,
      );
      toast.success("Đã thêm vào giỏ");
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || e?.message || "Không thể thêm vào giỏ",
      );
    }
  }

  return (
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
    </article>
  );
}
