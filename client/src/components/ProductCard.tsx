import { Heart } from "lucide-react";
import { useCart } from "../store/cart.store";
import { toast } from "../store/toast.store";

const PLACEHOLDER = "https://placehold.co/400x500?text=No+Image";

export interface ProductCardData {
  id: string;
  slug?: string;
  name: string;
  brand?: string;
  image?: string | null;
  price?: number | null;
  priceText?: string;
  variantId?: string | null;
  volume?: string;
  stock?: number;
}

export default function ProductCard({ item }: { item: ProductCardData }) {
  const addItem = useCart((s) => s.addItem);

  // Hết hàng khi: chưa có phiên bản để bán HOẶC tổng tồn kho <= 0
  const outOfStock =
    !item.variantId || (typeof item.stock === "number" && item.stock <= 0);

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
        {outOfStock && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 uppercase tracking-widest">
            Hết hàng
          </span>
        )}
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
  );
}
