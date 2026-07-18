import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { toast } from "../../store/toast.store";

type WishlistProduct = {
  id: string;
  slug?: string;
  name: string;
  description?: string;
  brand?: string;
  category?: string;
  image?: string | null;
  images?: string[];
};

const PLACEHOLDER = "https://placehold.co/400x500?text=No+Image";

export default function Wishlist() {
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api
      .get<WishlistProduct[]>("/account/wishlist")
      .then(({ data }) => {
        if (mounted) setProducts(data);
      })
      .catch(() => {
        if (mounted) setProducts([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function remove(productId: string) {
    try {
      const { data } = await api.delete<WishlistProduct[]>(`/account/wishlist/${productId}`);
      setProducts(data);
      toast.success("Đã xóa khỏi wishlist");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể xóa wishlist");
    }
  }

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#2D2925]">
      <section className="border-b border-[#E7E0D7] px-6 pb-7 pt-12 lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#9B9288]">
          Personal Portal
        </p>

        <h1 className="mt-2 font-serif text-4xl lg:text-5xl">
          Wishlist
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7C746C]">
          Danh sách sản phẩm yêu thích được lấy trực tiếp từ MongoDB.
        </p>
      </section>

      <main className="px-6 py-10 lg:px-12">
        {loading ? (
          <p className="text-sm text-[#7C746C]">Đang tải wishlist...</p>
        ) : products.length === 0 ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center border border-[#E2DBD2] bg-[#FFFDF9] text-center">
            <Heart size={38} className="text-[#8B7200]" />
            <h2 className="mt-5 font-serif text-3xl">Wishlist trống</h2>
            <p className="mt-2 max-w-md text-sm text-[#7C746C]">
              Những sản phẩm bạn yêu thích sẽ xuất hiện tại đây.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const image = product.images?.[0] || product.image || PLACEHOLDER;

              return (
                <article key={product.id} className="border border-[#E2DBD2] bg-[#FFFDF9]">
                  <Link to={`/products/${product.slug || product.id}`}>
                    <img
                      src={image}
                      alt={product.name}
                      className="aspect-[4/5] w-full bg-[#F0ECE7] object-cover"
                      onError={(event) => {
                        event.currentTarget.src = PLACEHOLDER;
                      }}
                    />
                  </Link>

                  <div className="p-5">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[#9A7D00]">
                      {product.brand || product.category || "Parfum"}
                    </p>
                    <h2 className="mt-2 font-serif text-xl">{product.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6F6861]">
                      {product.description || "Mùi hương tinh tế, sang trọng."}
                    </p>

                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#8D8379] hover:text-red-700"
                    >
                      <Trash2 size={13} />
                      Xóa khỏi wishlist
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
