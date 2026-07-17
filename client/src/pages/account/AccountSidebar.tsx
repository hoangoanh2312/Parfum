import {
  Clock3,
  Heart,
  LayoutDashboard,
  MapPin,
  Settings,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";

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