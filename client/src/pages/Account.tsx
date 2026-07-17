import { Outlet } from "react-router-dom";
import AccountSidebar from "./account/AccountSidebar";

export default function AccountLayout() {
  return (
    <div className="min-h-screen bg-[#FCF9F4]">
      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        <AccountSidebar />

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}