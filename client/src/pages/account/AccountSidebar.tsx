import {
  Clock3,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Settings,
  Sparkles,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../store/auth.store";
import { toast } from "../../store/toast.store";

const accountLinks = [
  {
    label: "Overview",
    path: "/account",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Order History",
    path: "/account/orders",
    icon: Clock3,
  },
  {
    label: "Wishlist",
    path: "/account/wishlist",
    icon: Heart,
  },
  {
    label: "Saved Addresses",
    path: "/account/addresses",
    icon: MapPin,
  },
  {
    label: "Scent Profile",
    path: "/account/scent-profile",
    icon: Sparkles,
  },
  {
    label: "Settings",
    path: "/account/settings",
    icon: Settings,
  },
];

export default function AccountSidebar() {
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Local logout still matters if the server session is already gone.
    } finally {
      logout();
      toast.success("Đã đăng xuất");
      navigate("/login");
    }
  };

  return (
    <aside className="w-full shrink-0 border-b border-[#E8E1D8] bg-[#FCF9F4] p-6 lg:w-[245px] lg:border-b-0 lg:border-r lg:p-8">
      <p className="mb-5 text-[9px] uppercase tracking-[0.25em] text-[#777068]">
        Account Menu
      </p>

      <nav className="space-y-2">
        {accountLinks.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 border-l-2 px-4 py-3 text-xs transition ${
                isActive
                  ? "border-[#9A7D00] bg-[#EEEAE5] text-[#927600]"
                  : "border-transparent text-[#6F6963] hover:bg-[#F1EDE7]"
              }`
            }
          >
            <Icon size={15} strokeWidth={1.4} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-5 flex w-full items-center gap-3 border-l-2 border-transparent px-4 py-3 text-left text-xs text-[#8B2F24] transition hover:bg-[#F1EDE7]"
      >
        <LogOut size={15} strokeWidth={1.4} />
        <span>Logout</span>
      </button>

      <div className="mt-12 bg-[#E8E4DF] p-5">
        <h3 className="font-serif text-base">Concierge Service</h3>

        <p className="mt-3 text-xs leading-5 text-[#756E67]">
          Dedicated olfactory guidance available 24/7 for members.
        </p>

        <button className="mt-5 border-b border-[#987B00] pb-1 text-[9px] uppercase tracking-widest text-[#806800]">
          Contact Expert
        </button>
      </div>
    </aside>
  );
}
