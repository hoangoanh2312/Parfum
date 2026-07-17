<<<<<<< HEAD
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
=======
import { Heart } from "lucide-react";
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1
import { useCart } from "../store/cart.store";
import { toast } from "../store/toast.store";

const PLACEHOLDER = "https://placehold.co/400x500?text=No+Image";

export interface ProductCardData {
  id: string;
  slug?: string;
  name: string;
  brand?: string;
<<<<<<< HEAD
  description?: string;
  price?: number | null;
  priceText?: string;
  image?: string | null;
  images?: string[];
  variantId?: string | null;
  volume?: string;
  stock?: number;
  gender?: string; // female | male | unisex (lọc Shop)
=======
  image?: string | null;
  price?: number | null;
  priceText?: string;
  variantId?: string | null;
  volume?: string;
  stock?: number;
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1
}

export default function ProductCard({ item }: { item: ProductCardData }) {
  const addItem = useCart((s) => s.addItem);
<<<<<<< HEAD
  const detailPath = `/products/${item.slug || item.id}`;
=======
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1

  // Hết hàng khi: chưa có phiên bản để bán HOẶC tổng tồn kho <= 0
  const outOfStock =
    !item.variantId || (typeof item.stock === "number" && item.stock <= 0);

<<<<<<< HEAD
  const image =
    item.images?.[0] ||
    item.image ||
    PLACEHOLDER;

=======
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1
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

=======
    <div className="bg-white p-5 hover:shadow-2xl duration-300 group">
      <div className="overflow-hidden relative">
        <img
          src={item.image || PLACEHOLDER}
          alt={item.name}
          onError={(e) => {
            // Ảnh trong DB hỏng/không tải được -> thay bằng ảnh mặc định
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
          }}
          className={
            "h-72 w-full object-cover group-hover:scale-110 duration-500 " +
            (outOfStock ? "opacity-60 grayscale" : "")
          }
        />
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1
        {outOfStock && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 uppercase tracking-widest">
            Hết hàng
          </span>
        )}
<<<<<<< HEAD

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
=======
      </div>

      <p className="uppercase text-gray-400 text-xs mt-5">{item.brand}</p>
      <h3 className="text-2xl font-serif mt-2">{item.name}</h3>

      <div className="flex justify-between mt-3">
        <span className="font-semibold">{item.priceText}</span>
        <Heart size={18} />
      </div>

      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className={
          "mt-6 w-full border py-3 uppercase tracking-widest duration-300 " +
          (outOfStock
            ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
            : "hover:bg-black hover:text-white")
        }
      >
        {outOfStock ? "Hết hàng" : "Thêm vào giỏ"}
      </button>
    </div>
>>>>>>> 370e5a108f256acb306946aad424ff837135ade1
  );
}
