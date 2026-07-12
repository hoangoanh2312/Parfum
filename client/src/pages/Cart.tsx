import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../store/cart.store';
import { api } from '../lib/api';

const vnd = (n: number) => (n || 0).toLocaleString('vi-VN') + '₫';

export default function Cart() {
  const { items, total, count, loadCart, updateItem, removeItem, clear } = useCart();

  useEffect(() => {
    loadCart();
  }, []);

  async function checkout() {
    try {
      const { data } = await api.get('/orders/checkout-preview');
      if (data.data.ok) {
        alert('Đủ hàng! Tổng thanh toán: ' + vnd(data.data.total));
      } else {
        alert('Một số sản phẩm không đủ tồn kho, vui lòng kiểm tra lại.');
      }
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Bạn cần đăng nhập để thanh toán');
    }
  }

  if (!items.length) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <ShoppingBag size={60} className="text-[#b8860b] mb-6" />
        <h1 className="font-heading text-4xl mb-3">Giỏ hàng trống</h1>
        <p className="text-gray-500 mb-8">Hãy thêm sản phẩm yêu thích vào giỏ.</p>
        <Link to="/shop" className="border border-black px-8 py-3 uppercase tracking-[3px] hover:bg-black hover:text-white duration-300">
          Tiếp tục mua sắm
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-heading text-4xl mb-8">Giỏ hàng ({count})</h1>

      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.variant} className="flex items-center gap-4 border-b pb-4">
            <img
              src={it.image || 'https://via.placeholder.com/80'}
              alt={it.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium">{it.name}</p>
              <p className="text-sm text-gray-500">{it.volume}</p>
              <p className="text-[#a67c1a]">{vnd(it.price)}</p>
            </div>

            <div className="flex items-center border rounded">
              <button className="p-2" onClick={() => updateItem(it.variant, it.quantity - 1)}>
                <Minus size={14} />
              </button>
              <span className="px-3 min-w-[2rem] text-center">{it.quantity}</span>
              <button className="p-2" onClick={() => updateItem(it.variant, it.quantity + 1)}>
                <Plus size={14} />
              </button>
            </div>

            <div className="w-28 text-right font-medium">{vnd(it.lineTotal || it.price * it.quantity)}</div>

            <button className="p-2 text-gray-400 hover:text-red-500" onClick={() => removeItem(it.variant)}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button onClick={clear} className="text-sm text-gray-500 hover:text-red-500">
          Xóa toàn bộ
        </button>
        <div className="text-right">
          <p className="text-gray-500">Tổng cộng</p>
          <p className="text-2xl font-heading">{vnd(total)}</p>
        </div>
      </div>

      <button
        onClick={checkout}
        className="mt-6 w-full bg-black text-white py-4 uppercase tracking-[3px] hover:bg-[#a67c1a] duration-300"
      >
        Thanh toán
      </button>
    </section>
  );
}
