import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../store/cart.store";
import { toast } from "../../store/toast.store";

const PLACEHOLDER = "https://placehold.co/400x500?text=No+Image";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price?: number | null;
  priceText?: string;
  image?: string | null;
  brand?: string;
  images?: string[];
  slug?: string;
  variantId?: string | null;
  volume?: string;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const detailPath = `/products/${product.slug || product.id || product._id}`;
  const outOfStock =
    !product.variantId ||
    (typeof product.stock === "number" && product.stock <= 0);
  const price =
    product.priceText ||
    (product.price != null
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(product.price)
      : "Liên hệ");
  const image = product.images?.[0] || product.image || PLACEHOLDER;

  async function handleAdd() {
    if (!product.variantId) {
      toast.error("Sản phẩm chưa có phiên bản để bán");
      return;
    }

    if (typeof product.stock === "number" && product.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    try {
      await addItem(
        {
          variant: product.variantId,
          product: product.id || product._id,
          name: product.name,
          slug: product.slug,
          image,
          volume: product.volume,
          price: product.price || 0,
          stock: product.stock,
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
          alt={product.name}
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
          {product.brand || "Eau De Parfum"}
        </p>

        <Link to={detailPath}>
          <h3 className="h-[62px] overflow-hidden font-noto-serif text-[24px] text-[#1E1D1A]">
            {product.name}
          </h3>
        </Link>

        <p className="mt-3 text-sm text-[#5F5E5E] leading-7 line-clamp-2">
          {product.description || "No description available."}
        </p>

        <div className="flex items-center justify-between mt-6">
          <span className="text-2xl font-semibold text-[#1C1C19]">{price}</span>

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
