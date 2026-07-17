import { Heart, ShoppingBag } from "lucide-react";

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
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
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

  return (
    <article className="group">
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F3EEE7] aspect-[4/5]">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover duration-500 group-hover:scale-105"
        />

        {/* Wishlist */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-[#1C1C19] hover:text-white duration-300">
          <Heart size={18} />
        </button>

        {/* Add to cart */}
        <div className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 duration-300">
          <button className="w-full h-14 bg-[#1C1C19] text-white uppercase tracking-[2px] text-xs flex items-center justify-center gap-2 hover:bg-[#735C00]">
            <ShoppingBag size={16} />
            Add to cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6">
        <p className="uppercase tracking-[3px] text-[10px] text-[#735C00]">
          {product.brand || "Eau De Parfum"}
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-[#1C1C19]">
          {product.name}
        </h3>

        <p className="mt-3 text-sm text-[#5F5E5E] leading-7 line-clamp-2">
          {product.description || "No description available."}
        </p>

        <div className="flex items-center justify-between mt-6">
          <span className="text-2xl font-semibold text-[#1C1C19]">
            {price}
          </span>

          <button className="uppercase tracking-[2px] text-[11px] font-semibold text-[#735C00] hover:underline">
            View
          </button>
        </div>
      </div>
    </article>
  );
}
