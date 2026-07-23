import { useEffect, useState } from "react";
import { Home, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "../../lib/api";
import { Address, useAuth } from "../../store/auth.store";
import { toast } from "../../store/toast.store";
import VietnamAddressFields from "../../components/VietnamAddressFields";

type AddressForm = {
  label: string;
  fullName: string;
  phone: string;
  line: string;
  ward: string;
  province: string;
};

const emptyForm: AddressForm = {
  label: "",
  fullName: "",
  phone: "",
  line: "",
  ward: "",
  province: "",
};

function formatAddress(item: Address) {
  return [item.line || item.detail, item.ward, item.district, item.province]
    .filter(Boolean)
    .join(", ");
}

export default function SavedAddresses() {
  const user = useAuth((state) => state.user);
  const setUser = useAuth((state) => state.setUser);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AddressForm>(emptyForm);

  useEffect(() => {
    setAddresses(user?.addresses || []);
  }, [user]);

  function syncAddresses(next: Address[]) {
    setAddresses(next);
    if (user) setUser({ ...user, addresses: next });
  }

  async function refreshUser(nextAddresses: Address[]) {
    try {
      const wasComplete = Boolean(user?.profileCompletionVoucherCode);
      const { data } = await api.get("/auth/me");
      setUser({
        ...(user || {}),
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        isEmailVerified: data.isEmailVerified,
        addresses: data.addresses || nextAddresses,
        profileCompletedAt: data.profileCompletedAt,
        profileCompletionVoucherCode: data.profileCompletionVoucherCode,
      });
      setAddresses(data.addresses || nextAddresses);
      return !wasComplete && Boolean(data.profileCompletionVoucherCode);
    } catch {
      syncAddresses(nextAddresses);
      return false;
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(address: Address) {
    setEditingId(address._id);
    setForm({
      label: address.label || "",
      fullName: address.fullName || "",
      phone: address.phone || "",
      line: address.line || address.detail || "",
      ward: address.ward || "",
      province: address.province || "",
    });
    setShowForm(true);
  }

  async function saveAddress(event: React.FormEvent) {
    event.preventDefault();

    if (!/^0\d{9}$/.test(form.phone.trim())) {
      toast.error("So dien thoai phai bat dau bang 0 va du 10 so");
      return;
    }

    try {
      setSaving(true);
      const request = editingId
        ? api.put(`/auth/me/addresses/${editingId}`, form)
        : api.post("/auth/me/addresses", form);
      const { data } = await request;
      const profileJustCompleted = await refreshUser(data);
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      toast.success(
        profileJustCompleted
          ? "Cap nhat ho so thanh cong. Voucher chao mung thanh vien moi da san sang."
          : editingId ? "Da cap nhat dia chi" : "Da them dia chi",
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the luu dia chi");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAddress(addressId: string) {
    try {
      const { data } = await api.delete(`/auth/me/addresses/${addressId}`);
      syncAddresses(data);
      toast.success("Da xoa dia chi");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the xoa dia chi");
    }
  }

  async function setDefault(address: Address) {
    try {
      const { data } = await api.patch(`/auth/me/addresses/${address._id}/default`);
      const profileJustCompleted = await refreshUser(data);
      toast.success(
        profileJustCompleted
          ? "Cap nhat ho so thanh cong. Voucher chao mung thanh vien moi da san sang."
          : "Da dat lam dia chi mac dinh",
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Khong the dat mac dinh");
    }
  }

  function isDefault(item: Address, index: number) {
    return item.isDefault ?? index === 0;
  }

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#2D2925]">
      <section className="border-b border-[#E7E0D7] px-6 pb-7 pt-12 lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#9B9288]">
          Personal Portal
        </p>

        <h1 className="mt-2 font-serif text-4xl lg:text-5xl">Saved Addresses</h1>
      </section>

      <main className="px-6 py-10 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl">Dia chi cua ban</h2>

            <p className="mt-1 text-sm text-[#8A8178]">
              Ban dang co {addresses.length} dia chi da luu.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="flex w-fit items-center gap-2 bg-[#806900] px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-white transition hover:bg-[#675500]"
          >
            <Plus size={15} />
            Them dia chi
          </button>
        </div>

        {showForm && (
          <form onSubmit={saveAddress} className="mb-8 border border-[#E2DBD2] bg-[#FFFDF9] p-6">
            <h3 className="font-serif text-2xl">
              {editingId ? "Chinh sua dia chi" : "Them dia chi moi"}
            </h3>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input
                value={form.label}
                onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
                placeholder="Nhan dia chi (Nha / Van phong)"
                className="border border-[#DCD4CB] bg-[#FCF9F4] px-4 py-3 text-sm outline-none"
              />
              <input
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                placeholder="Ho ten nguoi nhan"
                className="border border-[#DCD4CB] bg-[#FCF9F4] px-4 py-3 text-sm outline-none"
                required
              />
              <input
                value={form.phone}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    phone: event.target.value.replace(/\D/g, "").slice(0, 10),
                  }))
                }
                placeholder="So dien thoai"
                className="border border-[#DCD4CB] bg-[#FCF9F4] px-4 py-3 text-sm outline-none"
                required
              />
              <input
                value={form.line}
                onChange={(event) => setForm((prev) => ({ ...prev, line: event.target.value }))}
                placeholder="So nha, ten duong"
                className="border border-[#DCD4CB] bg-[#FCF9F4] px-4 py-3 text-sm outline-none"
                required
              />
              <VietnamAddressFields
                province={form.province}
                ward={form.ward}
                onProvinceChange={(province) =>
                  setForm((prev) => ({ ...prev, province }))
                }
                onWardChange={(ward) =>
                  setForm((prev) => ({ ...prev, ward }))
                }
                inputClassName="w-full border border-[#DCD4CB] bg-[#FCF9F4] px-4 py-3 text-sm outline-none focus:border-[#806900]"
                labelClassName="mb-2 block text-[10px] uppercase tracking-[1.3px] text-[#736B63]"
                wrapperClassName="grid gap-4 md:col-span-2 md:grid-cols-2"
                required
              />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                disabled={saving}
                className="bg-[#806900] px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-white disabled:opacity-60"
              >
                {saving ? "Dang luu..." : "Luu dia chi"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-[#CFC6BB] px-5 py-3 text-[10px] uppercase tracking-[0.16em]"
              >
                Huy
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-5 xl:grid-cols-2">
          {addresses.map((item, index) => (
            <article
              key={item._id}
              className="relative border border-[#E2DBD2] bg-[#FFFDF9] p-6 transition hover:border-[#B39A37]"
            >
              {isDefault(item, index) && (
                <span className="absolute right-5 top-5 bg-[#EEE8D4] px-3 py-1 text-[9px] uppercase tracking-[0.14em] text-[#846E0A]">
                  Mac dinh
                </span>
              )}

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#F0ECE7]">
                  {isDefault(item, index) ? (
                    <Home size={18} strokeWidth={1.4} />
                  ) : (
                    <MapPin size={18} strokeWidth={1.4} />
                  )}
                </div>

                <div className="pr-20">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#9A7D00]">
                    {item.label || "Dia chi"}
                  </p>

                  <h3 className="mt-3 font-serif text-xl">{item.fullName || user?.name}</h3>

                  <p className="mt-2 text-sm text-[#6F6861]">{item.phone}</p>

                  <p className="mt-2 max-w-md text-sm leading-6 text-[#6F6861]">
                    {formatAddress(item)}
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[#EAE4DC] pt-5">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#544E48] hover:text-[#8B7200]"
                  >
                    <Pencil size={13} />
                    Chinh sua
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteAddress(item._id)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#8D8379] hover:text-red-700"
                  >
                    <Trash2 size={13} />
                    Xoa
                  </button>
                </div>

                {!isDefault(item, index) && (
                  <button
                    type="button"
                    onClick={() => setDefault(item)}
                    className="text-[10px] uppercase tracking-[0.12em] text-[#8B7200]"
                  >
                    Dat lam mac dinh
                  </button>
                )}
              </div>
            </article>
          ))}

          <button
            type="button"
            onClick={openCreate}
            className="flex min-h-[250px] flex-col items-center justify-center border border-dashed border-[#CFC6BB] bg-[#F5F1EC] transition hover:bg-[#EEE9E2]"
          >
            <Plus size={28} strokeWidth={1.2} />

            <span className="mt-4 text-[10px] uppercase tracking-[0.18em]">Them dia chi moi</span>

            <span className="mt-2 text-xs text-[#91887E]">
              Them dia chi giao hang hoac nhan hoa don
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
