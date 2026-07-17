import { useEffect, useState } from "react";
import {
  Bell,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../store/auth.store";
import { toast } from "../../store/toast.store";

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const user = useAuth((state) => state.user);
  const setUser = useAuth((state) => state.setUser);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    promotionNotifications: false,
    orderNotifications: true,
  });

  useEffect(() => {
    if (!user) return;

    setForm((previous) => ({
      ...previous,
      fullName: user.name || "",
      email: user.email || "",
      phone: user.addresses?.[0]?.phone || "",
    }));
  }, [user]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.newPassword || form.confirmPassword || form.currentPassword) {
      if (form.newPassword !== form.confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp");
        return;
      }
      if (!form.currentPassword) {
        toast.error("Vui lòng nhập mật khẩu hiện tại");
        return;
      }
    }

    try {
      setSaving(true);
      const { data } = await api.put("/auth/me", {
        name: form.fullName,
        email: form.email,
      });

      setUser({
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        addresses: data.addresses || [],
      });

      if (form.currentPassword && form.newPassword) {
        await api.put("/auth/me/password", {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });

        setForm((previous) => ({
          ...previous,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }

      toast.success("Đã lưu thay đổi");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể lưu thay đổi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#2D2925]">
      <section className="border-b border-[#E7E0D7] px-6 pb-7 pt-12 lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#9B9288]">
          Personal Portal
        </p>

        <h1 className="mt-2 font-serif text-4xl lg:text-5xl">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7C746C]">
          Quản lý thông tin cá nhân, mật khẩu và tùy chọn thông báo của tài
          khoản.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 px-6 py-10 lg:px-12"
      >
        {/* Personal information */}
        <section className="border border-[#E2DBD2] bg-[#FFFDF9]">
          <div className="flex items-center gap-3 border-b border-[#E7E0D7] px-6 py-5">
            <User size={19} strokeWidth={1.4} />

            <div>
              <h2 className="font-serif text-2xl">
                Thông tin cá nhân
              </h2>

              <p className="mt-1 text-xs text-[#877E74]">
                Cập nhật thông tin hiển thị trong tài khoản.
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#736B63]">
                Họ và tên
              </span>

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="mt-3 w-full border border-[#DCD4CB] bg-[#FCF9F4] px-4 py-3 text-sm outline-none transition focus:border-[#927600]"
              />
            </label>

            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#736B63]">
                Số điện thoại
              </span>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-3 w-full border border-[#DCD4CB] bg-[#FCF9F4] px-4 py-3 text-sm outline-none transition focus:border-[#927600]"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#736B63]">
                Email
              </span>

              <div className="relative mt-3">
                <Mail
                  size={16}
                  strokeWidth={1.4}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8379]"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-[#DCD4CB] bg-[#FCF9F4] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#927600]"
                />
              </div>
            </label>
          </div>
        </section>

        {/* Password */}
        <section className="border border-[#E2DBD2] bg-[#FFFDF9]">
          <div className="flex items-center gap-3 border-b border-[#E7E0D7] px-6 py-5">
            <LockKeyhole size={19} strokeWidth={1.4} />

            <div>
              <h2 className="font-serif text-2xl">
                Đổi mật khẩu
              </h2>

              <p className="mt-1 text-xs text-[#877E74]">
                Sử dụng mật khẩu mạnh để bảo vệ tài khoản.
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-6">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#736B63]">
                Mật khẩu hiện tại
              </span>

              <div className="relative mt-3">
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full border border-[#DCD4CB] bg-[#FCF9F4] px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#927600]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#81786F]"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#736B63]">
                  Mật khẩu mới
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới"
                  className="mt-3 w-full border border-[#DCD4CB] bg-[#FCF9F4] px-4 py-3 text-sm outline-none transition focus:border-[#927600]"
                />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.15em] text-[#736B63]">
                  Xác nhận mật khẩu
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu mới"
                  className="mt-3 w-full border border-[#DCD4CB] bg-[#FCF9F4] px-4 py-3 text-sm outline-none transition focus:border-[#927600]"
                />
              </label>
            </div>

            <div className="flex items-start gap-3 bg-[#F1EDE7] p-4">
              <ShieldCheck
                size={18}
                strokeWidth={1.4}
                className="mt-0.5 shrink-0 text-[#806900]"
              />

              <p className="text-xs leading-5 text-[#726A62]">
                Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường,
                số và ký tự đặc biệt.
              </p>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="border border-[#E2DBD2] bg-[#FFFDF9]">
          <div className="flex items-center gap-3 border-b border-[#E7E0D7] px-6 py-5">
            <Bell size={19} strokeWidth={1.4} />

            <div>
              <h2 className="font-serif text-2xl">
                Tùy chọn thông báo
              </h2>

              <p className="mt-1 text-xs text-[#877E74]">
                Chọn những thông báo mà bạn muốn nhận.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#EAE4DC] px-6">
            <NotificationToggle
              title="Thông báo đơn hàng"
              description="Nhận thông báo về xác nhận, vận chuyển và trạng thái đơn hàng."
              name="orderNotifications"
              checked={form.orderNotifications}
              onChange={handleChange}
            />

            <NotificationToggle
              title="Thông báo qua email"
              description="Nhận cập nhật quan trọng về tài khoản qua email."
              name="emailNotifications"
              checked={form.emailNotifications}
              onChange={handleChange}
            />

            <NotificationToggle
              title="Khuyến mãi và ưu đãi"
              description="Nhận thông tin về chương trình giảm giá và sản phẩm mới."
              name="promotionNotifications"
              checked={form.promotionNotifications}
              onChange={handleChange}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-3 bg-[#816A00] px-7 py-4 text-[10px] uppercase tracking-[0.16em] text-white transition hover:bg-[#675500] disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}

interface NotificationToggleProps {
  title: string;
  description: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function NotificationToggle({
  title,
  description,
  name,
  checked,
  onChange,
}: NotificationToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 py-6">
      <div>
        <p className="font-serif text-lg">{title}</p>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[#81786F]">
          {description}
        </p>
      </div>

      <div className="relative shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />

        <div className="h-6 w-11 rounded-full bg-[#D8D1C8] transition peer-checked:bg-[#887000]" />

        <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
      </div>
    </label>
  );
}
