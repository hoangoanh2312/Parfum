import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../store/cart.store";
import { toast } from "../../store/toast.store";

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

export default function ProductCard({
  product,
}: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
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
  const image =
    product.images?.[0] ||
    product.image ||
    "https://picsum.photos/500/700";

  async function handleAddToCart() {
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
          name: product.name,
          image: product.image || product.images?.[0] || undefined,
          volume: product.volume,
          price: product.price || 0,
          stock: product.stock,
          quantity: 1,
        },
        1,
      );
      toast.success("Đã thêm vào giỏ");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Không thể thêm vào giỏ");
    }
  }

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-[#F3EEE7] aspect-[4/5]">
        <Link to={detailPath} className="block h-full w-full">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover duration-500 group-hover:scale-105"
          />
        </Link>

        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-[#1C1C19] hover:text-white duration-300">
          <Heart size={18} />
        </button>

        <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 duration-300">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="w-full h-14 bg-[#1C1C19] text-white uppercase tracking-[2px] text-xs flex items-center justify-center gap-2 hover:bg-[#735C00] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag size={16} />
            {outOfStock ? "Hết hàng" : "Add to cart"}
          </button>
        </div>
      </div>

      <Link to={detailPath} className="mt-6 block">
        <p className="uppercase tracking-[3px] text-[10px] text-[#735C00]">
          {product.brand || "Eau De Parfum"}
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-[#1C1C19]">
          {product.name}
        </h3>

        <p className="mt-3 text-sm text-[#5F5E5E] leading-7 line-clamp-2">
          {product.description || "No description available."}
        </p>
      </Link>

      <div className="flex items-center justify-between mt-6">
        <span className="text-2xl font-semibold text-[#1C1C19]">
          {price}
        </span>

        <Link
          to={detailPath}
          className="uppercase tracking-[2px] text-[11px] font-semibold text-[#735C00] hover:underline"
        >
          View
        </Link>
      </div>
    </article>
  );
}
