import { type FormEvent, useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, Home, Search } from "lucide-react";
import { Link, useNavigate, useRouteError } from "react-router-dom";
import ProductCard, { type ProductCardData } from "./ProductCard";
import { api } from "../lib/api";

type RouteErrorPageProps = {
  notFound?: boolean;
};

type RouteErrorWithStatus = {
  status: number;
};

type ProductListResponse = {
  data: ProductCardData[];
};

function hasStatus(error: unknown): error is RouteErrorWithStatus {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as RouteErrorWithStatus).status === "number"
  );
}

function GenericError() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#F8F5F0] px-5 py-16 text-center">
      <section className="w-full max-w-xl rounded-2xl border border-[#DED6CA] bg-white px-6 py-12 shadow-sm sm:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F3EEE7] text-[#735C00]">
          <AlertTriangle size={28} />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[3px] text-[#8B7100]">
          Đã xảy ra lỗi
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-[#1C1C19] sm:text-4xl">
          Không thể hiển thị trang này
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#615E57]">
          Vui lòng thử tải lại trang. Nếu lỗi vẫn tiếp diễn, hãy quay về trang chủ.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-11 items-center justify-center bg-[#1C1C19] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#735C00] focus:outline-none focus:ring-2 focus:ring-[#735C00]"
          >
            Thử tải lại
          </button>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#735C00] px-6 py-3 text-sm font-semibold text-[#735C00] transition hover:bg-[#F7F3EE] focus:outline-none focus:ring-2 focus:ring-[#735C00]"
          >
            <Home size={17} />
            Về trang chủ
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function RouteErrorPage({ notFound: forcedNotFound = false }: RouteErrorPageProps) {
  const error = useRouteError();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const notFound = forcedNotFound || (hasStatus(error) && error.status === 404);

  useEffect(() => {
    if (!notFound) return;

    const previousTitle = document.title;
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = robots?.getAttribute("content") ?? null;
    const createdRobots = !robots;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    document.title = "Không tìm thấy trang | L'Essence Noire";
    robots.content = "noindex, follow";
    let active = true;

    api
      .get<ProductListResponse>("/products", {
        params: { page: 1, limit: 4, sort: "featured" },
      })
      .then(({ data }) => {
        if (active) setProducts(Array.isArray(data.data) ? data.data.slice(0, 4) : []);
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoadingProducts(false);
      });

    return () => {
      active = false;
      document.title = previousTitle;
      if (createdRobots) robots.remove();
      else if (previousRobots !== null) robots.content = previousRobots;
      else robots.removeAttribute("content");
    };
  }, [notFound]);

  if (!notFound) return <GenericError />;

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyword = query.trim();
    navigate(keyword ? `/shop?search=${encodeURIComponent(keyword)}` : "/shop");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F8F5F0] pb-20">
      <section className="relative overflow-hidden border-b border-[#DED6CA] px-5 py-16 text-center sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#B89A45]/10 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#735C00]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <p className="font-serif text-[96px] font-semibold leading-none text-[#D9CDAF] sm:text-[132px]">
            404
          </p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[4px] text-[#8B7100]">
            Lạc giữa những tầng hương
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold text-[#1C1C19] sm:text-5xl">
            Không tìm thấy trang bạn cần
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#615E57] sm:text-base">
            Đường dẫn có thể đã được thay đổi hoặc không còn tồn tại. Hãy tìm kiếm sản phẩm, quay về
            trang chủ hoặc khám phá những lựa chọn nổi bật bên dưới.
          </p>

          <form
            onSubmit={submitSearch}
            role="search"
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="not-found-search" className="sr-only">
              Tìm kiếm nước hoa
            </label>
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8174]"
              />
              <input
                id="not-found-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo tên sản phẩm, thương hiệu..."
                className="h-[52px] w-full rounded-sm border border-[#CFC5B5] bg-white py-3 pl-12 pr-4 text-sm text-[#25221E] outline-none transition placeholder:text-[#9B9388] focus:border-[#735C00] focus:ring-2 focus:ring-[#735C00]/15"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-sm bg-[#1C1C19] px-7 text-xs font-semibold uppercase tracking-[1.5px] text-white transition hover:bg-[#735C00] focus:outline-none focus:ring-2 focus:ring-[#735C00] focus:ring-offset-2"
            >
              Tìm kiếm
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-medium text-[#735C00]">
            <Link to="/" className="inline-flex items-center gap-2 hover:underline">
              <Home size={15} />
              Về trang chủ
            </Link>
            <Link to="/shop" className="inline-flex items-center gap-2 hover:underline">
              Xem tất cả sản phẩm
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pt-14 md:px-10 lg:px-16 xl:px-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#8B7100]">
              Gợi ý dành cho bạn
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[#1B1B18] sm:text-4xl">
              Sản phẩm nổi bật
            </h2>
          </div>
          <Link
            to="/shop?sort=featured"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.5px] text-[#735C00] hover:underline"
          >
            Khám phá cửa hàng
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-7 lg:grid-cols-4">
          {loadingProducts &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} aria-hidden="true">
                <div className="aspect-[4/5] animate-pulse bg-[#EDE7DE]" />
                <div className="mt-4 h-3 w-1/3 animate-pulse bg-[#E3DCCF]" />
                <div className="mt-3 h-5 w-3/4 animate-pulse bg-[#E3DCCF]" />
              </div>
            ))}

          {!loadingProducts &&
            products.map((product) => (
              <ProductCard key={product.id || product._id} item={product} />
            ))}
        </div>

        {!loadingProducts && products.length === 0 && (
          <div className="mt-9 rounded-sm border border-[#DED6CA] bg-white px-6 py-8 text-center">
            <p className="text-sm text-[#615E57]">
              Chưa thể tải sản phẩm nổi bật. Bạn vẫn có thể xem toàn bộ bộ sưu tập tại cửa hàng.
            </p>
            <Link
              to="/shop"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.5px] text-[#735C00] hover:underline"
            >
              Đến cửa hàng
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
