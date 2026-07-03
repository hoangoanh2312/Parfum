import { useEffect, useState } from "react";
import { api } from "../../lib/api";

type Product = {
  _id: string;
  name: string;
  slug: string;
  description?: string;

  brand?: {
    _id: string;
    name: string;
  };

  category?: {
    _id: string;
    name: string;
  };

  images: string[];

  isActive: boolean;
};

type Option = {
  _id: string;
  name: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [images, setImages] = useState<File[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);

  

const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    brand: "",
    category: "",
});

  useEffect(() => {
    loadProducts();
    loadOptions();
  }, []);

  async function loadProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data);
    } finally {
      setLoading(false);
    }
  }

  async function loadOptions() {
    const [brandRes, categoryRes] = await Promise.all([
      api.get("/brands"),
      api.get("/categories"),
    ]);

    setBrands(brandRes.data.data);
    setCategories(categoryRes.data.data);
  }

  async function toggleStatus(id: string, isActive: boolean) {
    await api.patch(`/products/${id}/status`, {
      isActive: !isActive,
    });

    loadProducts();
  }

function resetForm() {
  setEditingId(null);
  setImages([]);

  setForm({
    name: "",
    slug: "",
    description: "",
    brand: "",
    category: "",
  });
}

function closeModal() {
  resetForm();
  setShowModal(false);
}

async function saveProduct() {
  if (
    !form.name ||
    !form.slug ||
    !form.brand ||
    !form.category
  ) {
    alert("Vui lòng nhập đầy đủ");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("slug", form.slug);
    formData.append("description", form.description);
    formData.append("brand", form.brand);
    formData.append("category", form.category);

    images.forEach((img) => {
    formData.append("images", img);
});
    if (editingId) {
      await api.put(
        `/products/${editingId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        },
      );

      alert("Cập nhật thành công");
    } else {
      await api.post(
        "/products",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        },
      );

      alert("Thêm thành công");
    }

    closeModal();
    loadProducts();

  } catch (err) {
    console.error(err);
    alert("Có lỗi xảy ra");
  }
}

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <div>
  <div className="mb-6 flex items-center justify-between">
    <h1 className="text-3xl font-bold">
      Quản lý sản phẩm
    </h1>

    <button
      onClick={() => {
        resetForm();
        setShowModal(true);
      }}
      className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
    >
      + Thêm sản phẩm
    </button>
  </div>

  <div className="overflow-x-auto rounded-xl bg-white shadow">
    <div className="border-b px-6 py-4">
      <p className="font-semibold">
        Tổng sản phẩm: {products.length}
      </p>
    </div>

    <table className="min-w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left">Ảnh</th>
          <th className="px-6 py-3 text-left">Tên</th>
          <th className="px-6 py-3 text-left">Thương hiệu</th>
          <th className="px-6 py-3 text-left">Danh mục</th>
          <th className="px-6 py-3 text-left">Trạng thái</th>
          <th className="px-6 py-3 text-center">Hành động</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr
            key={product._id}
            className="border-t hover:bg-gray-50"
          >
            <td className="px-6 py-4">
              {product.images?.length ? (
                <img
  src={product.images?.[0]}
  className="h-14 w-14 rounded object-cover"
/>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border text-gray-400">
                  📷
                </div>
              )}
            </td>

            <td className="px-6 py-4 font-medium">
              {product.name}
            </td>

            <td className="px-6 py-4">
              {product.brand?.name}
            </td>

            <td className="px-6 py-4">
              {product.category?.name}
            </td>

            <td className="px-6 py-4">
              {product.isActive ? (
                <span className="rounded bg-green-100 px-3 py-1 text-green-700">
                  Đang bán
                </span>
              ) : (
                <span className="rounded bg-red-100 px-3 py-1 text-red-700">
                  Đã ẩn
                </span>
              )}
            </td>

            <td className="space-x-2 px-6 py-4 text-center">
              <button
                onClick={() => {
                  setEditingId(product._id);

                 setForm({
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    brand: product.brand?._id ?? "",
    category: product.category?._id ?? "",
});

setImages([]);

                  setShowModal(true);
                }}
                className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
              >
                Sửa
              </button>

              <button
                onClick={() =>
                  toggleStatus(
                    product._id,
                    product.isActive,
                  )
                }
                className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              >
                {product.isActive
                  ? "Ẩn"
                  : "Hiện"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
        {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[650px] rounded-xl bg-white p-6 shadow-xl">

            <h2 className="mb-5 text-2xl font-bold">
              {editingId
                ? "Cập nhật sản phẩm"
                : "Thêm sản phẩm"}
            </h2>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Tên sản phẩm"
              className="mb-3 w-full rounded border p-2"
            />

            <input
              value={form.slug}
              onChange={(e) =>
                setForm({
                  ...form,
                  slug: e.target.value,
                })
              }
              placeholder="Slug"
              className="mb-3 w-full rounded border p-2"
            />

            <select
              value={form.brand}
              onChange={(e) =>
                setForm({
                  ...form,
                  brand: e.target.value,
                })
              }
              className="mb-3 w-full rounded border p-2"
            >
              <option value="">
                Chọn thương hiệu
              </option>

              {brands.map((brand) => (
                <option
                  key={brand._id}
                  value={brand._id}
                >
                  {brand.name}
                </option>
              ))}
            </select>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              className="mb-3 w-full rounded border p-2"
            >
              <option value="">
                Chọn danh mục
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              placeholder="Mô tả"
              className="mb-4 w-full rounded border p-2"
            />

            <label className="mb-2 block font-semibold">
              Ảnh sản phẩm
            </label>
<input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => {
    if (!e.target.files) return;

    setImages(Array.from(e.target.files));
  }}
/>


<div className="mt-4 flex flex-wrap gap-3">
  {images.map((img, index) => (
    <div
      key={index}
      className="relative"
    >
      <img
        src={URL.createObjectURL(img)}
        className="h-24 w-24 rounded border object-cover"
      />

      <button
        type="button"
        onClick={() =>
          setImages(images.filter((_, i) => i !== index))
        }
        className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-white"
      >
        ×
      </button>
    </div>
  ))}
</div>

<div className="mt-6 flex justify-end gap-2">
  <button
    type="button"
    onClick={closeModal}
    className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
  >
    Huỷ
  </button>

  <button
    type="button"
    onClick={saveProduct}
    className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
  >
    {editingId ? "Cập nhật" : "Lưu"}
  </button>
</div>

</div>
</div>
)}
    </div>
  );
}