import { LayoutDashboard, ListCheck, UserSearch, List, User, LogOut, Home } from "lucide-react";
import useUsersStore, { type IUsersStore } from "@/store/users-store";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink, type SidebarLinkItem } from "@/components/ui/sidebar";

function MenuItems() {
  const { user } = useUsersStore() as IUsersStore;
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/login");
  };

  const iconClass = "size-5 shrink-0";

  const userMenuItems: SidebarLinkItem[] = [
    { label: "Dashboard", href: "/user/dashboard", icon: <LayoutDashboard className={iconClass} /> },
    { label: "Appointments", href: "/user/appointments", icon: <List className={iconClass} /> },
    { label: "Profile", href: "/user/profile", icon: <User className={iconClass} /> },
  ];

  const ownerMenuItems: SidebarLinkItem[] = [
    { label: "Dashboard", href: "/owner/dashboard", icon: <LayoutDashboard className={iconClass} /> },
    { label: "Manage Salons", href: "/owner/salons", icon: <ListCheck className={iconClass} /> },
    { label: "Appointments", href: "/owner/appointments", icon: <List className={iconClass} /> },
    { label: "Customers", href: "/owner/customers", icon: <UserSearch className={iconClass} /> },
    { label: "Profile", href: "/owner/profile", icon: <User className={iconClass} /> },
  ];

  const menuItems = user?.role === "user" ? userMenuItems : ownerMenuItems;

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-6">
        <div className="flex flex-1 flex-col overflow-hidden">
          <nav className="mt-2 flex flex-col gap-2" aria-label="Private navigation">
            {menuItems.map((item) => {
              const active = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
              return (
                <div key={item.href} className={active ? "rounded-xl bg-slate-950 text-white" : ""}>
                  <SidebarLink link={{ ...item, icon: <span className={active ? "text-white" : "text-slate-600"}>{item.icon}</span> }} open={open} active={active} />
                </div>
              );
            })}
          </nav>
        </div>
        <div className="border-t border-slate-200 pt-3">
          <SidebarLink link={{ label: "Home", href: "/", icon: <Home className={iconClass} /> }} open={open} />
          <button type="button" onClick={handleLogout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-50">
            <span className="grid size-6 shrink-0 place-items-center"><LogOut className={iconClass} /></span>
            <span className={`overflow-hidden whitespace-nowrap transition-opacity ${open ? "opacity-100" : "opacity-0"}`}>Logout</span>
          </button>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export default MenuItems;
