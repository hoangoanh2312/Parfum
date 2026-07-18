import {
  Heart,
  ShoppingBag,
  Sun,
  Moon,
  Quote,
  Share2,
  MessageSquare,
  AtSign,
<<<<<<< HEAD
  ImagePlus,
  X,
=======
>>>>>>> feature/pf-32-category-brand-crud
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useCart } from "../store/cart.store";
import { toast } from "../store/toast.store";
<<<<<<< HEAD
import { useAuth } from "../store/auth.store";
=======
>>>>>>> feature/pf-32-category-brand-crud

const PLACEHOLDER = "https://placehold.co/900x1100?text=No+Image";

type ProductVariant = {
  id: string;
  sku?: string;
  size: string;
  volume: string;
  price: number;
  priceText: string;
  stock: number;
  images?: string[];
  isActive?: boolean;
};

type ProductDetailData = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  fragranceFamily?: string;
  concentration?: string;
  gallery: string[];
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  variants: ProductVariant[];
  stock: number;
};

type ProductListItem = {
  id: string;
  slug?: string;
  name: string;
  brand?: string;
  category?: string;
  image?: string | null;
  images?: string[];
  price?: number | null;
  priceText?: string;
};

type ProductListResponse = {
  data: ProductListItem[];
};

type ReviewItem = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt?: string;
};

const vnd = (value: number) => `${(value || 0).toLocaleString("vi-VN")}đ`;

export default function ProductDetail() {
  const { idOrSlug } = useParams();
  const addItem = useCart((state) => state.addItem);
<<<<<<< HEAD
  const user = useAuth((state) => state.user);
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductListItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
=======
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductListItem[]>([]);
>>>>>>> feature/pf-32-category-brand-crud
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
<<<<<<< HEAD
  const [showReviewForm, setShowReviewForm] = useState(false);
=======
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
>>>>>>> feature/pf-32-category-brand-crud
  const [reviewForm, setReviewForm] = useState({
    guestName: "",
    guestEmail: "",
    rating: 5,
    comment: "",
<<<<<<< HEAD
  });
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [reviewImagePreview, setReviewImagePreview] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
=======
    imageUrl: "",
  });
  const [reviewMessage, setReviewMessage] = useState("");
>>>>>>> feature/pf-32-category-brand-crud

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
<<<<<<< HEAD
        const { data } = await api.get<ProductDetailData>(`/products/${idOrSlug}`);
        if (!active) return;

        const firstVariant =
          data.variants.find((variant) => variant.isActive !== false && variant.stock > 0) ||
          data.variants[0];

        setProduct(data);
        setSelectedVariantId(firstVariant?.id || "");
        setSelectedImage(data.gallery?.[0] || firstVariant?.images?.[0] || PLACEHOLDER);
        setError("");
      } catch (e: any) {
        if (!active) return;
        setError(e?.response?.data?.message || "Không tải được chi tiết sản phẩm");
=======
        const { data } = await api.get<ProductDetailData>(
          `/products/${idOrSlug}`,
        );
        if (!active) return;

        const firstVariant =
          data.variants.find(
            (variant) => variant.isActive !== false && variant.stock > 0,
          ) || data.variants[0];

        setProduct(data);
        setSelectedVariantId(firstVariant?.id || "");
        setSelectedImage(
          data.gallery?.[0] || firstVariant?.images?.[0] || PLACEHOLDER,
        );
        setError("");
      } catch (e: any) {
        if (!active) return;
        setError(
          e?.response?.data?.message || "Không tải được chi tiết sản phẩm",
        );
>>>>>>> feature/pf-32-category-brand-crud
      } finally {
        if (active) setLoading(false);
      }
    }

    if (idOrSlug) loadProduct();

    return () => {
      active = false;
    };
  }, [idOrSlug]);

  useEffect(() => {
    let active = true;

    api
<<<<<<< HEAD
      .get<ProductListResponse>("/products", { params: { limit: 4, sort: "newest" } })
=======
      .get<ProductListResponse>("/products", {
        params: { limit: 4, sort: "newest" },
      })
>>>>>>> feature/pf-32-category-brand-crud
      .then(({ data }) => {
        if (!active) return;
        setRelatedProducts(Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => {
        if (active) setRelatedProducts([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    if (!product?.id) return;

    let active = true;

    api
      .get<ReviewItem[]>(`/reviews/product/${product.id}`)
      .then(({ data }) => {
        if (active) setReviews(Array.isArray(data) ? data : []);
=======
    let active = true;

    if (!idOrSlug) return;

    api
      .get<ReviewItem[]>(`/reviews/products/${idOrSlug}`)
      .then(({ data }) => {
        if (active) setReviews(data);
>>>>>>> feature/pf-32-category-brand-crud
      })
      .catch(() => {
        if (active) setReviews([]);
      });

    return () => {
      active = false;
    };
<<<<<<< HEAD
  }, [product?.id]);
=======
  }, [idOrSlug]);
>>>>>>> feature/pf-32-category-brand-crud

  const selectedVariant = useMemo(
    () =>
      product?.variants.find((variant) => variant.id === selectedVariantId) ||
      product?.variants[0],
    [product, selectedVariantId],
  );

  const gallery = useMemo(() => {
    const variantImages = selectedVariant?.images || [];
<<<<<<< HEAD
    return Array.from(new Set([...(product?.gallery || []), ...variantImages])).filter(Boolean);
  }, [product, selectedVariant]);

  const currentImage = selectedImage || gallery[0] || PLACEHOLDER;
  const insetImage = gallery.find((image) => image !== currentImage) || currentImage;
  const availableStock = selectedVariant?.stock ?? 0;
  const canAdd = Boolean(selectedVariant?.id) && selectedVariant?.isActive !== false && availableStock > 0;
=======
    return Array.from(
      new Set([...(product?.gallery || []), ...variantImages]),
    ).filter(Boolean);
  }, [product, selectedVariant]);

  const currentImage = selectedImage || gallery[0] || PLACEHOLDER;
  const insetImage =
    gallery.find((image) => image !== currentImage) || currentImage;
  const availableStock = selectedVariant?.stock ?? 0;
  const canAdd =
    Boolean(selectedVariant?.id) &&
    selectedVariant?.isActive !== false &&
    availableStock > 0;
>>>>>>> feature/pf-32-category-brand-crud

  const notes = [
    {
      icon: <Sun size={18} strokeWidth={1.4} />,
      title: "TOP NOTES",
      description: "The immediate impression. Effervescent and ethereal.",
      items: product?.notes.top || [],
    },
    {
      icon: <Heart size={17} strokeWidth={1.4} />,
      title: "HEART NOTES",
      description: "The soul of the fragrance. Full-bodied and radiant.",
      items: product?.notes.middle || [],
    },
    {
      icon: <Moon size={17} strokeWidth={1.4} />,
      title: "BASE NOTES",
      description: "The lasting memory. Rich, grounded, and sensual.",
      items: product?.notes.base || [],
    },
  ];

  async function handleAddToCart() {
    if (!product || !selectedVariant) return;

    if (!canAdd) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    try {
      await addItem(
        {
          variant: selectedVariant.id,
          product: product.id,
          name: product.name,
          slug: product.slug,
          image: currentImage === PLACEHOLDER ? null : currentImage,
          volume: selectedVariant.volume || selectedVariant.size,
          price: selectedVariant.price,
          stock: selectedVariant.stock,
          quantity: 1,
        },
        1,
      );
      toast.success("Đã thêm vào giỏ");
    } catch (e: any) {
<<<<<<< HEAD
      toast.error(e?.response?.data?.message || e?.message || "Không thể thêm vào giỏ");
=======
      toast.error(
        e?.response?.data?.message || e?.message || "Không thể thêm vào giỏ",
      );
>>>>>>> feature/pf-32-category-brand-crud
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
<<<<<<< HEAD
    if (!product) return;

    if (!user && (!reviewForm.guestName.trim() || !reviewForm.guestEmail.trim())) {
      toast.error("Vui lòng nhập tên và email để gửi đánh giá");
      return;
    }

    try {
      setSubmittingReview(true);
      let imageUrl = "";

      if (reviewImage) {
        const formData = new FormData();
        formData.append("image", reviewImage);
        const { data } = await api.post<{ url: string }>("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = data.url;
      }

      await api.post("/reviews", {
        product: product.id,
        guestName: user ? undefined : reviewForm.guestName.trim(),
        guestEmail: user ? undefined : reviewForm.guestEmail.trim(),
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
        images: imageUrl ? [imageUrl] : [],
      });
      setReviewForm({ guestName: "", guestEmail: "", rating: 5, comment: "" });
      setReviewImage(null);
      setReviewImagePreview("");
      setReviewMessage("Đã gửi đánh giá. Review sẽ hiển thị sau khi admin duyệt.");
      setShowReviewForm(false);
      toast.success("Đã gửi đánh giá");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Không thể gửi đánh giá");
    } finally {
      setSubmittingReview(false);
    }
  }

  function handleReviewImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB");
      event.target.value = "";
      return;
    }

    setReviewImage(file);
    setReviewImagePreview(URL.createObjectURL(file));
  }

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  const featuredReview = reviews[0];
  const sideReviews = reviews.slice(1, 3);
=======

    try {
      await api.post(`/reviews/products/${idOrSlug}`, {
        guestName: reviewForm.guestName,
        guestEmail: reviewForm.guestEmail,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
        images: reviewForm.imageUrl.trim() ? [reviewForm.imageUrl.trim()] : [],
      });
      setReviewForm({
        guestName: "",
        guestEmail: "",
        rating: 5,
        comment: "",
        imageUrl: "",
      });
      setReviewMessage(
        "Đã gửi đánh giá. Review sẽ hiển thị sau khi admin duyệt.",
      );
      toast.success("Đã gửi đánh giá");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Không thể gửi đánh giá");
    }
  }

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
>>>>>>> feature/pf-32-category-brand-crud

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf8f2] px-6 py-24 text-[#615e57]">
        <div className="mx-auto max-w-[1240px]">Đang tải sản phẩm...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#fbf8f2] px-6 py-24 text-[#615e57]">
        <div className="mx-auto max-w-[1240px]">
          <Link to="/shop" className="text-[#8b7100] underline">
            Quay lại Shop
          </Link>
<<<<<<< HEAD
          <p className="mt-6 text-red-600">{error || "Không tìm thấy sản phẩm"}</p>
=======
          <p className="mt-6 text-red-600">
            {error || "Không tìm thấy sản phẩm"}
          </p>
>>>>>>> feature/pf-32-category-brand-crud
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#292824]">
<<<<<<< HEAD

=======
>>>>>>> feature/pf-32-category-brand-crud
      <main>
        {/* Product Hero */}
        <section className="bg-[#fbf8f2]">
          <div className="mx-auto grid max-w-[1240px] gap-14 px-6 py-12 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-16">
            {/* Image */}
            <div className="relative min-h-[570px] bg-[#f5f1eb]">
              <img
                src={currentImage}
                alt={product.name}
                className="h-full min-h-[570px] w-full object-contain p-12"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />

              {gallery.length > 1 && (
                <button
                  onClick={() => setSelectedImage(insetImage)}
                  className="absolute -bottom-10 right-[-20px] hidden h-[205px] w-[205px] border-[3px] border-white bg-white shadow-sm md:block"
                >
<<<<<<< HEAD
                <img
                  src={insetImage}
                  alt={`${product.name} detail`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER;
                  }}
                />
=======
                  <img
                    src={insetImage}
                    alt={`${product.name} detail`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />
>>>>>>> feature/pf-32-category-brand-crud
                </button>
              )}
            </div>

            {/* Information */}
            <div className="flex flex-col justify-center py-6 lg:pl-2">
              <p className="mb-7 text-[8px] uppercase tracking-[1.5px] text-[#aaa69e]">
<<<<<<< HEAD
                {product.category || "Collections"}&nbsp;&nbsp;/&nbsp;&nbsp;{product.fragranceFamily || "Signature"}
=======
                {product.category || "Collections"}&nbsp;&nbsp;/&nbsp;&nbsp;
                {product.fragranceFamily || "Signature"}
>>>>>>> feature/pf-32-category-brand-crud
              </p>

              <h1 className="font-serif text-[44px] leading-[1.05] tracking-[-1px] md:text-[58px]">
                {product.name}
              </h1>

              <p className="mt-3 font-serif text-[16px] text-[#8e8980]">
                {product.concentration || product.brand || "Eau de Parfum"}
              </p>

              <p className="mt-7 max-w-[475px] text-[13px] leading-[1.85] text-[#615e57]">
<<<<<<< HEAD
                {product.description || "Mùi hương tinh tế, sang trọng và phù hợp cho nhiều dịp sử dụng."}
              </p>

              <p className="mt-7 font-serif text-[23px] font-semibold text-[#927600]">
                {selectedVariant ? selectedVariant.priceText || vnd(selectedVariant.price) : "Liên hệ"}
=======
                {product.description ||
                  "Mùi hương tinh tế, sang trọng và phù hợp cho nhiều dịp sử dụng."}
              </p>

              <p className="mt-7 font-serif text-[23px] font-semibold text-[#927600]">
                {selectedVariant
                  ? selectedVariant.priceText || vnd(selectedVariant.price)
                  : "Liên hệ"}
>>>>>>> feature/pf-32-category-brand-crud
              </p>

              {product.variants.length > 1 && (
                <div className="mt-5 flex max-w-[410px] flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const active = variant.id === selectedVariant?.id;
<<<<<<< HEAD
                    const disabled = variant.stock <= 0 || variant.isActive === false;
=======
                    const disabled =
                      variant.stock <= 0 || variant.isActive === false;
>>>>>>> feature/pf-32-category-brand-crud

                    return (
                      <button
                        key={variant.id}
                        disabled={disabled}
                        onClick={() => {
                          setSelectedVariantId(variant.id);
<<<<<<< HEAD
                          if (variant.images?.[0]) setSelectedImage(variant.images[0]);
=======
                          if (variant.images?.[0])
                            setSelectedImage(variant.images[0]);
>>>>>>> feature/pf-32-category-brand-crud
                        }}
                        className={`border px-4 py-2 text-[9px] font-semibold uppercase tracking-[1.4px] transition ${
                          active
                            ? "border-[#8b7100] bg-[#8b7100] text-white"
                            : "border-[#e7dfd1] text-[#615e57] hover:border-[#8b7100]"
                        } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                      >
                        {variant.size || variant.volume || "Default"}
                      </button>
                    );
                  })}
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={!canAdd}
                className="mt-6 flex h-[50px] w-full max-w-[410px] items-center justify-center gap-2 bg-[#8b7100] text-[10px] font-semibold uppercase tracking-[2px] text-white transition hover:bg-[#715c00] disabled:cursor-not-allowed disabled:bg-[#d6d3d1]"
              >
                <ShoppingBag size={14} />
                {canAdd ? "Add to bag" : "Sold out"}
              </button>

              <button className="mt-3 h-[48px] w-full max-w-[410px] border border-[#e7dfd1] bg-transparent text-[9px] font-semibold uppercase tracking-[1.8px] text-[#615e57]">
                Complimentary sample included
              </button>

              <div className="mt-16 grid max-w-[410px] grid-cols-2 gap-8 border-t border-[#ece5d8] pt-8">
                <div>
                  <p className="text-[7px] uppercase tracking-[1px] text-[#aaa59c]">
                    Concentration
                  </p>
<<<<<<< HEAD
                  <p className="mt-2 text-[11px]">{product.concentration || "Signature"}</p>
=======
                  <p className="mt-2 text-[11px]">
                    {product.concentration || "Signature"}
                  </p>
>>>>>>> feature/pf-32-category-brand-crud
                </div>

                <div>
                  <p className="text-[7px] uppercase tracking-[1px] text-[#aaa59c]">
                    Stock
                  </p>
                  <p className="mt-2 text-[11px]">
                    {canAdd ? `${availableStock} available` : "Sold out"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Olfactory Pyramid */}
        <section className="mt-10 bg-[#efebe5] py-20">
          <div className="mx-auto max-w-[1240px] px-6 md:px-10 lg:px-14">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="font-serif text-[31px]">
                  The Olfactory Pyramid
                </h2>

                <p className="mt-4 max-w-[480px] text-[11px] leading-[1.65] text-[#77736b]">
                  The architecture of the scent evolves over eight hours,
                  shifting from crystalline brightness to a deep, resonant
                  warmth.
                </p>
              </div>

              <p className="text-[8px] font-semibold uppercase tracking-[3px] text-[#8b7100]">
                Notes composition
              </p>
            </div>

            <div className="mt-12 grid bg-[#fbf9f5] md:grid-cols-3">
              {notes.map((note, index) => (
                <article
                  key={note.title}
                  className={`px-9 py-10 md:px-10 ${
                    index !== notes.length - 1
                      ? "border-b border-[#ebe5da] md:border-b-0 md:border-r"
                      : ""
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center bg-[#efebe3] text-[#9a830e]">
                    {note.icon}
                  </div>

                  <h3 className="mt-7 font-serif text-[16px] tracking-[1px]">
                    {note.title}
                  </h3>

                  <p className="mt-4 max-w-[225px] text-[10px] leading-[1.6] text-[#77736d]">
                    {note.description}
                  </p>

                  <div className="mt-6 space-y-2">
<<<<<<< HEAD
                    {(note.items.length ? note.items : ["Đang cập nhật"]).map((item) => (
                      <p key={item} className="text-[10px] text-[#3c3a35]">
                        {item}
                      </p>
                    ))}
=======
                    {(note.items.length ? note.items : ["Đang cập nhật"]).map(
                      (item) => (
                        <p key={item} className="text-[10px] text-[#3c3a35]">
                          {item}
                        </p>
                      ),
                    )}
>>>>>>> feature/pf-32-category-brand-crud
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Related products */}
        <section className="bg-[#fbf8f2] py-24">
          <div className="mx-auto max-w-[1240px] px-6 md:px-10 lg:px-14">
            <h2 className="text-center font-serif text-[25px] italic">
              Complete the Ritual
            </h2>

            <div className="mt-14 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
<<<<<<< HEAD
                <Link key={item.id} to={`/products/${item.slug || item.id}`} className="group">
=======
                <Link
                  key={item.id}
                  to={`/products/${item.slug || item.id}`}
                  className="group"
                >
>>>>>>> feature/pf-32-category-brand-crud
                  <div className="aspect-square overflow-hidden bg-[#f2eee7]">
                    <img
                      src={item.images?.[0] || item.image || PLACEHOLDER}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                    />
                  </div>

                  <p className="mt-5 text-[8px] uppercase text-[#969189]">
                    {item.category || item.brand || "Parfum"}
                  </p>

<<<<<<< HEAD
                  <h3 className="mt-2 font-serif text-[14px]">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-[11px] text-[#8b7100]">
                    {item.priceText || (item.price ? vnd(item.price) : "Liên hệ")}
=======
                  <h3 className="mt-2 font-serif text-[14px]">{item.name}</h3>

                  <p className="mt-2 text-[11px] text-[#8b7100]">
                    {item.priceText ||
                      (item.price ? vnd(item.price) : "Liên hệ")}
>>>>>>> feature/pf-32-category-brand-crud
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
<<<<<<< HEAD
        <section className="bg-[#e9e5df] py-28">
          <div className="mx-auto max-w-[1240px] px-6 md:px-10 lg:px-14">
            <div className="text-center">
              <h2 className="font-serif text-[34px] md:text-[42px]">
                Voices of the Evening
              </h2>

              <div className="mt-7 flex items-center justify-center gap-3">
                <span className="text-[17px] tracking-[3px] text-[#8b7100]">
                  {reviews.length ? "★★★★★".slice(0, Math.round(averageRating)) : "☆☆☆☆☆"}
                </span>
                <span className="text-[9px] font-semibold tracking-[0.5px] text-[#45433e]">
=======
        <section className="bg-[#e9e5df] py-24">
          <div className="mx-auto max-w-[1050px] px-6 md:px-10">
            <div className="text-center">
              <h2 className="font-serif text-[31px]">Voices of the Evening</h2>

              <div className="mt-3 flex items-center justify-center gap-1 text-[#8b7100]">
                <span className="tracking-[2px]">
                  {reviews.length
                    ? "★★★★★".slice(0, Math.round(averageRating))
                    : "No reviews"}
                </span>
                <span className="ml-1 text-[8px] font-semibold text-[#45433e]">
>>>>>>> feature/pf-32-category-brand-crud
                  {averageRating ? averageRating.toFixed(1) : "0.0"} / 5.0
                </span>
              </div>
            </div>

<<<<<<< HEAD
            {reviewMessage && (
              <p className="mx-auto mt-8 max-w-xl bg-[#f4f0e8] px-4 py-3 text-center text-[11px] text-green-700">
                {reviewMessage}
              </p>
            )}

            <div className="mt-20 grid gap-12 md:grid-cols-[1fr_0.9fr] md:gap-16">
              <article className="relative md:pl-10">
                <Quote
                  size={42}
                  strokeWidth={1}
                  className="absolute -left-1 -top-8 text-[#ddd6c8]"
                />

                {featuredReview ? (
                  <>
                    <p className="max-w-[650px] font-serif text-[26px] leading-[1.5] md:text-[30px]">
                      {featuredReview.comment}
                    </p>

                    {featuredReview.images?.length > 0 && (
                      <div className="mt-8 flex flex-wrap gap-4">
                        {featuredReview.images.map((image) => (
                          <a
                            key={image}
                            href={image}
                            target="_blank"
                            rel="noreferrer"
                            className="block h-28 w-28 overflow-hidden border border-[#d8d2c8] bg-[#f4f0e8] md:h-36 md:w-36"
                          >
                            <img
                              src={image}
                              alt="Review"
                              className="h-full w-full object-cover transition duration-500 hover:scale-105"
                            />
                          </a>
                        ))}
                      </div>
                    )}

                    <p className="mt-10 text-[9px] font-semibold uppercase tracking-[2.4px]">
                      — {featuredReview.userName}, Verified Collector
                    </p>
                  </>
                ) : (
                  <>
                    <p className="max-w-[650px] font-serif text-[26px] leading-[1.5] md:text-[30px]">
                      Chưa có đánh giá nào được duyệt cho sản phẩm này.
                    </p>

                    <p className="mt-10 text-[9px] font-semibold uppercase tracking-[2.4px]">
                      — Be the first voice
                    </p>
                  </>
                )}
              </article>

              <div className="space-y-10 border-[#d8d2c8] md:border-l md:pl-12">
                {sideReviews.length > 0 ? (
                  sideReviews.map((review) => (
                    <article
                      key={review.id}
                      className="border-b border-[#d8d2c8] pb-10 last:border-b-0"
                    >
                      <h3 className="font-serif text-[22px]">
                        {review.comment.split(".")[0] || "A beautiful impression"}.
                      </h3>

                      <p className="mt-7 max-w-[520px] text-[11px] leading-[1.8] text-[#625e57]">
                        {review.comment}
                      </p>

                      {review.images?.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-3">
                          {review.images.map((image) => (
                            <a
                              key={image}
                              href={image}
                              target="_blank"
                              rel="noreferrer"
                              className="block h-20 w-20 overflow-hidden border border-[#d8d2c8] bg-[#f4f0e8]"
                            >
                              <img
                                src={image}
                                alt="Review"
                                className="h-full w-full object-cover transition duration-500 hover:scale-105"
                              />
                            </a>
                          ))}
                        </div>
                      )}

                      <p className="mt-7 text-[8px] font-semibold uppercase tracking-[1.8px]">
=======
            <div className="mt-14 grid gap-12 md:grid-cols-[1fr_0.9fr]">
              <div className="space-y-8">
                {reviews.length === 0 ? (
                  <p className="text-center text-sm text-[#6e6a63] md:text-left">
                    Chưa có review đã duyệt cho sản phẩm này.
                  </p>
                ) : (
                  reviews.map((review) => (
                    <article
                      key={review.id}
                      className="relative border-b border-[#d9d4cb] pb-8"
                    >
                      <Quote
                        size={34}
                        strokeWidth={1}
                        className="absolute -left-6 -top-4 text-[#ded8ca]"
                      />
                      <div className="text-[#8b7100]">
                        {"★".repeat(review.rating)}
                      </div>
                      <p className="mt-4 font-serif text-[21px] leading-[1.55]">
                        {review.comment}
                      </p>
                      {review.images?.length > 0 && (
                        <div className="mt-5 flex gap-3">
                          {review.images.map((image) => (
                            <img
                              key={image}
                              src={image}
                              alt="Review"
                              className="h-20 w-20 object-cover"
                            />
                          ))}
                        </div>
                      )}
                      <p className="mt-6 text-[8px] font-semibold uppercase tracking-[1.5px]">
>>>>>>> feature/pf-32-category-brand-crud
                        — {review.userName}
                      </p>
                    </article>
                  ))
<<<<<<< HEAD
                ) : (
                  <article className="border-b border-[#d8d2c8] pb-10">
                    <h3 className="font-serif text-[22px]">
                      Share your impression.
                    </h3>

                    <p className="mt-7 max-w-[520px] text-[11px] leading-[1.8] text-[#625e57]">
                      Những đánh giá sau khi admin duyệt sẽ xuất hiện tại đây.
                    </p>
                  </article>
                )}
              </div>
            </div>

            <div className="mt-24 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <button className="border-b border-[#8b7100] pb-2 text-[9px] font-semibold uppercase tracking-[2.4px]">
                Read all {reviews.length} reviews
              </button>

              <button
                type="button"
                onClick={() => setShowReviewForm((value) => !value)}
                className="bg-[#8b7100] px-7 py-4 text-[9px] font-semibold uppercase tracking-[2.2px] text-white transition hover:bg-[#715c00]"
              >
                {showReviewForm ? "Đóng form" : "Viết đánh giá"}
              </button>
            </div>

            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="mx-auto mt-12 max-w-2xl border border-[#d9d4cb] bg-[#fbf8f2] p-8"
              >
                <h3 className="font-serif text-[26px]">Write a review</h3>
                <p className="mt-3 text-[11px] leading-[1.7] text-[#6e6a63]">
                  {user
                    ? `Đang gửi bằng tài khoản ${user.name || user.email || "của bạn"}. Review sẽ được hiển thị sau khi admin duyệt.`
                    : "Bạn chưa đăng nhập, vui lòng nhập tên/email. Review sẽ được hiển thị sau khi admin duyệt."}
                </p>

                {!user && (
                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="text-[8px] uppercase tracking-[1.5px] text-[#8b7100]">
                      Name
                    </span>
                    <input
                      value={reviewForm.guestName}
                      onChange={(e) =>
                        setReviewForm((prev) => ({ ...prev, guestName: e.target.value }))
                      }
                      className="mt-2 h-11 w-full border border-[#d9d4cb] bg-transparent px-3 text-sm outline-none focus:border-[#8b7100]"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-[8px] uppercase tracking-[1.5px] text-[#8b7100]">
                      Email
                    </span>
                    <input
                      type="email"
                      value={reviewForm.guestEmail}
                      onChange={(e) =>
                        setReviewForm((prev) => ({ ...prev, guestEmail: e.target.value }))
                      }
                      className="mt-2 h-11 w-full border border-[#d9d4cb] bg-transparent px-3 text-sm outline-none focus:border-[#8b7100]"
                      required
                    />
                  </label>
                </div>
                )}

                <label className="mt-5 block">
                  <span className="text-[8px] uppercase tracking-[1.5px] text-[#8b7100]">
                    Rating
                  </span>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))
                    }
                    className="mt-2 h-11 w-full border border-[#d9d4cb] bg-transparent px-3 text-sm outline-none focus:border-[#8b7100]"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} sao
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-5 block">
                  <span className="text-[8px] uppercase tracking-[1.5px] text-[#8b7100]">
                    Comment
                  </span>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                    }
                    className="mt-2 min-h-32 w-full border border-[#d9d4cb] bg-transparent px-3 py-3 text-sm outline-none focus:border-[#8b7100]"
                    required
                  />
                </label>

                <div className="mt-5">
                  <p className="text-[8px] uppercase tracking-[1.5px] text-[#8b7100]">
                    Review image
                  </p>

                  {reviewImagePreview ? (
                    <div className="relative mt-2 overflow-hidden border border-[#d9d4cb] bg-[#f4f0e8]">
                      <img
                        src={reviewImagePreview}
                        alt="Review preview"
                        className="h-52 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setReviewImage(null);
                          setReviewImagePreview("");
                        }}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white text-[#4d4740] shadow-sm transition hover:bg-[#1c1c19] hover:text-white"
                        aria-label="Xóa ảnh đã chọn"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center border border-dashed border-[#cfc6bb] bg-[#f4f0e8] px-6 py-8 text-center transition hover:border-[#8b7100] hover:bg-[#f0eadf]">
                      <ImagePlus size={24} strokeWidth={1.4} className="text-[#8b7100]" />

                      <span className="mt-3 text-[10px] font-semibold uppercase tracking-[1.8px] text-[#4f4942]">
                        Chọn ảnh từ thư viện
                      </span>

                      <span className="mt-2 text-[11px] text-[#7a736b]">
                        JPG, PNG hoặc WEBP, tối đa 5MB
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReviewImageChange}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>

                <button
                  disabled={submittingReview}
                  className="mt-6 h-12 w-full bg-[#8b7100] text-[9px] font-semibold uppercase tracking-[2px] text-white transition hover:bg-[#715c00] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submittingReview ? "Đang gửi..." : "Submit review"}
                </button>
              </form>
            )}
=======
                )}
              </div>

              <form onSubmit={handleSubmitReview} className="bg-[#fbf8f2] p-8">
                <h3 className="font-serif text-[22px]">Write a review</h3>
                <p className="mt-3 text-[10px] leading-[1.7] text-[#6e6a63]">
                  Review sẽ được hiển thị sau khi admin duyệt.
                </p>

                {reviewMessage && (
                  <p className="mt-4 bg-green-50 px-3 py-2 text-[10px] text-green-700">
                    {reviewMessage}
                  </p>
                )}

                <label className="mt-6 block text-[8px] uppercase tracking-[1.5px] text-[#8b7100]">
                  Name
                </label>
                <input
                  value={reviewForm.guestName}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      guestName: e.target.value,
                    }))
                  }
                  className="mt-2 h-11 w-full border border-[#d9d4cb] bg-transparent px-3 text-sm"
                  required
                />

                <label className="mt-5 block text-[8px] uppercase tracking-[1.5px] text-[#8b7100]">
                  Email
                </label>
                <input
                  type="email"
                  value={reviewForm.guestEmail}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      guestEmail: e.target.value,
                    }))
                  }
                  className="mt-2 h-11 w-full border border-[#d9d4cb] bg-transparent px-3 text-sm"
                  required
                />

                <label className="mt-6 block text-[8px] uppercase tracking-[1.5px] text-[#8b7100]">
                  Rating
                </label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      rating: Number(e.target.value),
                    }))
                  }
                  className="mt-2 h-11 w-full border border-[#d9d4cb] bg-transparent px-3 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} sao
                    </option>
                  ))}
                </select>

                <label className="mt-5 block text-[8px] uppercase tracking-[1.5px] text-[#8b7100]">
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  className="mt-2 min-h-28 w-full border border-[#d9d4cb] bg-transparent px-3 py-3 text-sm"
                  required
                />

                <label className="mt-5 block text-[8px] uppercase tracking-[1.5px] text-[#8b7100]">
                  Image URL
                </label>
                <input
                  type="url"
                  value={reviewForm.imageUrl}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                  className="mt-2 h-11 w-full border border-[#d9d4cb] bg-transparent px-3 text-sm"
                  placeholder="https://..."
                />

                <button className="mt-6 h-11 w-full bg-[#8b7100] text-[9px] font-semibold uppercase tracking-[2px] text-white">
                  Submit review
                </button>
              </form>
            </div>
>>>>>>> feature/pf-32-category-brand-crud
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#fbf8f2]">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-16 md:grid-cols-2 md:px-10 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1.2fr] lg:px-14">
          <div>
            <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-black text-[11px] text-white">
              LOGO
            </div>

            <h3 className="mt-6 font-serif text-[17px] font-semibold">
              The Olfactory Editorial
            </h3>

            <p className="mt-6 max-w-[250px] text-[9px] leading-[1.7] text-[#8c877f]">
              A curated archive of high-end scents and the stories they tell.
              Elevating the art of perfumery through editorial precision.
            </p>

            <div className="mt-5 flex gap-3 text-[#aaa59d]">
              <Share2 size={15} strokeWidth={1.4} />
              <MessageSquare size={15} strokeWidth={1.4} />
              <AtSign size={15} strokeWidth={1.4} />
            </div>
          </div>

          <FooterColumn
            title="NAVIGATION"
<<<<<<< HEAD
            links={["Our Story", "Shipping & Returns", "Privacy Policy", "Contact"]}
=======
            links={[
              "Our Story",
              "Shipping & Returns",
              "Privacy Policy",
              "Contact",
            ]}
>>>>>>> feature/pf-32-category-brand-crud
          />

          <FooterColumn
            title="COLLECTIONS"
            links={[
              "The Resin Archive",
              "Floral Monologues",
              "Citrus Studies",
              "Limited Editions",
            ]}
          />

          <div>
            <h4 className="text-[9px] font-semibold tracking-[1px]">
              NEWSLETTER
            </h4>

            <p className="mt-6 max-w-[260px] text-[9px] leading-[1.6] text-[#8b867e]">
              Join our list for exclusive releases and editorial insights.
            </p>

            <div className="mt-7 flex border-b border-[#d9d4cb] pb-3">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent text-[9px] outline-none placeholder:text-[#aaa59e]"
              />

              <button className="text-[14px]">→</button>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-4 border-t border-[#e4dfd6] px-6 py-7 text-[7px] uppercase tracking-[0.6px] text-[#99948c] md:flex-row md:px-10 lg:px-14">
          <p>© 2024 The Olfactory Editorial. All Rights Reserved.</p>

          <div className="flex gap-7">
            <span>Paris</span>
            <span>Grasse</span>
            <span>New York</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FooterColumnProps {
  title: string;
  links: string[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h4 className="text-[9px] font-semibold tracking-[1px]">{title}</h4>

      <div className="mt-6 space-y-4">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="block text-[9px] text-[#8b867e] transition hover:text-[#8b7100]"
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
