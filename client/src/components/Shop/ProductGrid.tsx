import ProductCard from "./ProductCard";

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
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductGrid({
  products,
  loading = false,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse motion-reduce:animate-none"
          >
            <div className="aspect-[4/5] bg-gray-200 rounded" />

            <div className="h-6 bg-gray-200 rounded mt-5" />

            <div className="h-4 bg-gray-200 rounded mt-3" />

            <div className="h-4 bg-gray-200 rounded mt-2 w-2/3" />

            <div className="h-5 bg-gray-200 rounded mt-5 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-lg border border-dashed border-[#D0C5AF] bg-[#F7F3EE] px-5 py-16 text-center">
        <h2 className="text-2xl font-semibold text-[#1C1C19]">
          Không tìm thấy sản phẩm phù hợp
        </h2>

        <p className="text-gray-500 mt-3">
          Hãy thử thay đổi từ khóa hoặc bộ lọc sản phẩm.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
        />
      ))}
    </div>
  );
}
