import {
  AtSign,
  ChevronRight,
  ClipboardList,
  Cog,
  Heart,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Share2,
  Sparkles,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { Address, useAuth } from "../store/auth.store";

type AccountUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  addresses: Address[];
  createdAt?: string;
};

type ProductRecommendation = {
  id: string;
  slug?: string;
  name: string;
  category?: string;
  brand?: string;
  description?: string;
  image?: string | null;
  images?: string[];
  price?: number | null;
  priceText?: string;
};

type ProductListResponse = {
  data: ProductRecommendation[];
};

type AddressForm = {
  label: string;
  phone: string;
  detail: string;
};

const emptyAddress: AddressForm = { label: "", phone: "", detail: "" };
const PHONE_PATTERN = /^0\d{9}$/;

const accountMenu = [
  { label: "Overview", icon: ClipboardList, path: "/account" },
  { label: "Order History", icon: Package, path: "/account" },
  { label: "Wishlist", icon: Heart, path: "/account" },
  { label: "Saved Addresses", icon: MapPin, path: "/account" },
  { label: "Scent Profile", icon: Sparkles, path: "/account" },
  { label: "Settings", icon: Cog, path: "/account" },
];

const formatDate = (value?: string) => {
  if (!value) return "recently";
  return new Intl.DateTimeFormat("vi-VN", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

const formatVnd = (value?: number | null) =>
  value == null ? "Liên hệ" : `${value.toLocaleString("vi-VN")}đ`;

export default function Account() {
  const authUser = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "" });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddress);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [memberSince, setMemberSince] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      try {
        setLoading(true);
        const [userResult, productsResult] = await Promise.allSettled([
          api.get<AccountUser>("/auth/me"),
          api.get<ProductListResponse>("/products", { params: { limit: 3, sort: "newest" } }),
        ]);

        if (!active) return;

        if (userResult.status === "fulfilled") {
          const user = userResult.value.data;
          setProfile({ name: user.name || "", email: user.email || "" });
          setAddresses(user.addresses || []);
          setMemberSince(formatDate(user.createdAt));
          setUser({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            addresses: user.addresses || [],
          });
        } else {
          setError(userResult.reason?.response?.data?.message || "Không tải được tài khoản");
        }

        if (productsResult.status === "fulfilled") {
          setRecommendations(productsResult.value.data.data || []);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAccount();

    return () => {
      active = false;
    };
  }, [setUser]);

  function notify(text: string) {
    setMessage(text);
    setError("");
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    try {
      const { data } = await api.put<AccountUser>("/auth/me", profile);
      setProfile({ name: data.name, email: data.email });
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        addresses: data.addresses || addresses,
      });
      notify("Đã cập nhật thông tin cá nhân");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Cập nhật thông tin thất bại");
    }
  }

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    try {
      await api.put("/auth/me/password", password);
      setPassword({ currentPassword: "", newPassword: "" });
      notify("Đã đổi mật khẩu");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  }

  async function saveAddress(e: FormEvent) {
    e.preventDefault();
    if (!PHONE_PATTERN.test(addressForm.phone.trim())) {
      setError("Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số");
      setMessage("");
      return;
    }

    try {
      const { data } = editingId
        ? await api.put<Address[]>(`/auth/me/addresses/${editingId}`, addressForm)
        : await api.post<Address[]>("/auth/me/addresses", addressForm);

      setAddresses(data);
      setAddressForm(emptyAddress);
      setEditingId(null);
      if (authUser) setUser({ ...authUser, addresses: data });
      notify(editingId ? "Đã cập nhật địa chỉ" : "Đã thêm địa chỉ");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Lưu địa chỉ thất bại");
    }
  }

  async function deleteAddress(id: string) {
    try {
      const { data } = await api.delete<Address[]>(`/auth/me/addresses/${id}`);
      setAddresses(data);
      if (authUser) setUser({ ...authUser, addresses: data });
      notify("Đã xóa địa chỉ");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Xóa địa chỉ thất bại");
    }
  }

  function editAddress(address: Address) {
    setEditingId(address._id);
    setAddressForm({
      label: address.label || "",
      phone: address.phone || "",
      detail: address.detail || "",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f1] px-6 py-16 text-[#777269]">
        Đang tải tài khoản...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f1] text-[#292722]">
      <main className="mx-auto max-w-[1450px] px-5 py-14 md:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[210px_1fr]">
          <aside>
            <p className="text-[8px] font-semibold uppercase tracking-[1.5px] text-[#948f85]">
              Account menu
            </p>

            <nav className="mt-5 space-y-1">
              {accountMenu.map(({ label, icon: Icon }, index) => (
                <button
                  key={label}
                  type="button"
                  className={`flex h-10 w-full items-center gap-3 border-l-2 px-3 text-left text-[10px] transition ${
                    index === 0
                      ? "border-[#a58a19] bg-[#f0ece5] text-[#8b7100]"
                      : "border-transparent text-[#777269] hover:bg-[#f3efe8]"
                  }`}
                >
                  <Icon size={14} strokeWidth={1.4} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-12 bg-[#ebe7e1] px-5 py-6">
              <h3 className="font-serif text-[16px] leading-tight">
                Concierge
                <br />
                Service
              </h3>
              <p className="mt-4 text-[9px] leading-[1.65] text-[#777269]">
                Dedicated olfactory guidance available for members.
              </p>
            </div>
          </aside>

          <section>
            <div className="flex flex-col justify-between gap-5 border-b border-[#eee9e1] pb-6 md:flex-row md:items-end">
              <div>
                <p className="text-[8px] uppercase tracking-[2px] text-[#9c978e]">
                  Personal portal
                </p>
                <h1 className="mt-2 font-serif text-[34px] leading-none md:text-[40px]">
                  Hello, {profile.name || profile.email || "Member"}.
                </h1>
              </div>

              <div className="text-left md:text-right">
                <p className="font-serif text-[10px] italic text-[#716d66]">
                  Member since {memberSince}
                </p>
                <p className="mt-1 text-[8px] font-semibold uppercase tracking-[1px] text-[#8b7100]">
                  {authUser?.role || "customer"} status
                </p>
              </div>
            </div>

            {message && (
              <div className="mt-8 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-8 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_0.9fr]">
              <section className="bg-[#f3efea] p-6">
                <h2 className="font-serif text-[20px]">Profile Details</h2>
                <form onSubmit={saveProfile} className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field label="Full name">
                    <input
                      value={profile.name}
                      onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                      className="h-11 w-full border border-[#d7d0c5] bg-[#faf7f1] px-3 text-[11px] outline-none focus:border-[#8b7100]"
                      required
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                      className="h-11 w-full border border-[#d7d0c5] bg-[#faf7f1] px-3 text-[11px] outline-none focus:border-[#8b7100]"
                      required
                    />
                  </Field>
                  <button className="h-11 w-fit bg-[#8b7100] px-7 text-[8px] font-semibold uppercase tracking-[1px] text-white">
                    Save profile
                  </button>
                </form>
              </section>

              <section className="bg-[#ffd95f] px-7 py-6">
                <h2 className="font-serif text-[17px] text-[#786315]">Change Password</h2>
                <form onSubmit={changePassword} className="mt-5 space-y-4">
                  <input
                    type="password"
                    placeholder="Current password"
                    value={password.currentPassword}
                    onChange={(e) =>
                      setPassword((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    className="h-11 w-full border border-[#d4b941] bg-[#fff4b8] px-3 text-[11px] outline-none"
                    required
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    value={password.newPassword}
                    onChange={(e) => setPassword((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className="h-11 w-full border border-[#d4b941] bg-[#fff4b8] px-3 text-[11px] outline-none"
                    minLength={6}
                    required
                  />
                  <button className="h-10 bg-[#8b7100] px-7 text-[8px] font-semibold uppercase tracking-[1px] text-white">
                    Update password
                  </button>
                </form>
              </section>
            </div>

            <div className="mt-10 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
              <section>
                <h2 className="font-serif text-[18px]">Recent Acquisitions</h2>
                <div className="mt-5 bg-[#f4f0ea] px-5 py-8 text-[10px] leading-[1.7] text-[#777269]">
                  Lịch sử đơn hàng chưa có API trong task này, nên không hiển thị giá mẫu từ code.
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-[18px]">Saved Residences</h2>
                  {editingId && (
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setAddressForm(emptyAddress);
                      }}
                      className="text-[7px] uppercase tracking-[1px] text-[#8b7100]"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>

                <form onSubmit={saveAddress} className="mt-5 grid gap-3">
                  <input
                    placeholder="Label"
                    value={addressForm.label}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, label: e.target.value }))}
                    className="h-10 border border-[#e4ddd2] bg-[#fcfaf6] px-3 text-[10px] outline-none focus:border-[#8b7100]"
                    required
                  />
                  <input
                    placeholder="Phone"
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm((prev) => ({
                        ...prev,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      }))
                    }
                    className="h-10 border border-[#e4ddd2] bg-[#fcfaf6] px-3 text-[10px] outline-none focus:border-[#8b7100]"
                    inputMode="numeric"
                    pattern="0[0-9]{9}"
                    title="Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số"
                    required
                  />
                  <p className="-mt-2 text-[8px] text-[#8b867e]">
                    Số điện thoại gồm 10 chữ số và bắt đầu bằng 0.
                  </p>
                  <input
                    placeholder="Address detail"
                    value={addressForm.detail}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, detail: e.target.value }))}
                    className="h-10 border border-[#e4ddd2] bg-[#fcfaf6] px-3 text-[10px] outline-none focus:border-[#8b7100]"
                    required
                  />
                  <button className="flex h-10 items-center justify-center gap-2 bg-[#eeeae4] text-[7px] uppercase tracking-[1px] text-[#777269]">
                    <Plus size={14} strokeWidth={1} />
                    {editingId ? "Update address" : "Add new address"}
                  </button>
                </form>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {addresses.length === 0 ? (
                    <div className="min-h-[145px] border border-[#e4ddd2] bg-[#fcfaf6] p-5 text-[10px] text-[#777269]">
                      Chưa có địa chỉ nào.
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <div key={address._id} className="min-h-[145px] border border-[#e4ddd2] bg-[#fcfaf6] p-5">
                        <p className="text-[7px] font-semibold uppercase tracking-[1px] text-[#8b7100]">
                          {address.label}
                        </p>
                        <p className="mt-4 font-serif text-[12px]">{profile.name || profile.email}</p>
                        <p className="mt-2 text-[9px] leading-[1.6]">
                          {address.phone}
                          <br />
                          {address.detail}
                        </p>
                        <div className="mt-5 flex gap-4">
                          <button onClick={() => editAddress(address)} className="text-[7px] font-semibold uppercase">
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAddress(address._id)}
                            className="text-[7px] font-semibold uppercase"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            <section className="mt-16">
              <div className="text-center">
                <p className="text-[8px] uppercase tracking-[4px] text-[#a09a90]">
                  Curated just for you
                </p>
                <h2 className="mt-2 font-serif text-[28px] italic">Latest From MongoDB</h2>
              </div>

              <div className="mt-10 grid gap-7 md:grid-cols-3">
                {recommendations.map((product) => (
                  <RecommendationCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </section>
        </div>
      </main>

      <AccountFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="mb-2 block text-[8px] font-semibold uppercase tracking-[1px] text-[#948f85]">
        {label}
      </span>
      {children}
    </label>
  );
}

function RecommendationCard({ product }: { product: ProductRecommendation }) {
  const image =
    product.images?.[0] ||
    product.image ||
    "https://placehold.co/700x520?text=No+Image";

  return (
    <Link to={`/products/${product.slug || product.id}`} className="group block">
      <div className="aspect-[1.28/1] overflow-hidden bg-[#eee9e1]">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <p className="mt-5 text-[7px] uppercase tracking-[1px] text-[#a09a91]">
        {product.category || product.brand || "Parfum"}
      </p>
      <h3 className="mt-2 font-serif text-[15px]">{product.name}</h3>
      <p className="mt-2 text-[9px] leading-[1.6] text-[#716d66]">
        {product.priceText || formatVnd(product.price)}
      </p>
    </Link>
  );
}

function AccountFooter() {
  return (
    <footer className="bg-[#f4f4f3]">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1.2fr]">
        <div>
          <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-black text-[11px] text-white">
            LOGO
          </div>
          <h3 className="mt-6 font-serif text-[17px] font-semibold">
            The Olfactory Editorial
          </h3>
          <p className="mt-6 max-w-[250px] text-[9px] leading-[1.7] text-[#8c877f]">
            A curated archive of high-end scents and the stories they tell.
          </p>
          <div className="mt-5 flex gap-3 text-[#aaa59d]">
            <Share2 size={15} strokeWidth={1.4} />
            <MessageSquare size={15} strokeWidth={1.4} />
            <AtSign size={15} strokeWidth={1.4} />
          </div>
        </div>

        <FooterColumn title="NAVIGATION" links={["Our Story", "Shipping & Returns", "Privacy Policy", "Contact"]} />
        <FooterColumn title="COLLECTIONS" links={["The Resin Archive", "Floral Monologues", "Citrus Studies", "Limited Editions"]} />

        <div>
          <h4 className="text-[9px] font-semibold tracking-[1px]">NEWSLETTER</h4>
          <p className="mt-6 max-w-[260px] text-[9px] leading-[1.6] text-[#8b867e]">
            Join our list for exclusive releases and editorial insights.
          </p>
          <div className="mt-7 flex border-b border-[#d9d4cb] pb-3">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent text-[9px] outline-none placeholder:text-[#aaa59e]"
            />
            <button type="button">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-[9px] font-semibold tracking-[1px]">{title}</h4>
      <div className="mt-6 space-y-4">
        {links.map((link) => (
          <a key={link} href="#" className="block text-[9px] text-[#8b867e] hover:text-[#8b7100]">
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
