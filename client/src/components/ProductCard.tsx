import { Heart } from 'lucide-react';
import { useCart } from '../store/cart.store';

const PLACEHOLDER = 'https://placehold.co/400x500?text=No+Image';

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

  async function handleAdd() {
    if (!item.variantId) {
      alert('Sản phẩm chưa có phiên bản để bán');
      return;
    }
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
    alert('Đã thêm vào giỏ');
  }

  return (
    <div className="bg-white p-5 hover:shadow-2xl duration-300 group">
      <div className="overflow-hidden">
        <img
          src={item.image || PLACEHOLDER}
          alt={item.name}
          onError={(e) => {
            // Ảnh trong DB hỏng/không tải được -> thay bằng ảnh mặc định
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
          }}
          className="h-72 w-full object-cover group-hover:scale-110 duration-500"
        />
      </div>

      <p className="uppercase text-gray-400 text-xs mt-5">{item.brand}</p>
      <h3 className="text-2xl font-serif mt-2">{item.name}</h3>

      <div className="flex justify-between mt-3">
        <span className="font-semibold">{item.priceText}</span>
        <Heart size={18} />
      </div>

      <button
        onClick={handleAdd}
        className="mt-6 w-full border py-3 uppercase tracking-widest hover:bg-black hover:text-white duration-300"
      >
        Thêm vào giỏ
      </button>
    </div>
  );
}
