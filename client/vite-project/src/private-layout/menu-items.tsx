import { LayoutDashboard, ListCheck, UserSearch, List, User, LogOut } from "lucide-react";
import useUsersStore, { type IUsersStore } from "@/store/users-store";
import { useNavigate, useResolvedPath } from "react-router-dom";
import Cookies from "js-cookie";

function MenuItems() {
  const { user } = useUsersStore() as IUsersStore;
  const navigate = useNavigate();
  const pathname = useResolvedPath("").pathname;

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/login");
  };

  const iconSize = 20;

  const userMenuItems = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: <LayoutDashboard size={iconSize} />,
    },
    {
      name: "Appointments",
      path: "/user/appointments",
      icon: <List size={iconSize} />,
    },
    {
      name: "Profile",
      path: "/user/profile",
      icon: <User size={iconSize} />,
    },
  ];

  const ownerMenuItems = [
    {
      name: "Dashboard",
      path: "/owner/dashboard",
      icon: <LayoutDashboard size={iconSize} />,
    },
    {
      name: "Register and Manage Salons",
      path: "/owner/salons",
      icon: <ListCheck size={iconSize} />,
    },
    {
      name: "Appointments",
      path: "/owner/appointments",
      icon: <List size={iconSize} />,
    },
    {
      name: "Customers",
      path: "/owner/customers",
      icon: <UserSearch size={iconSize} />,
    },
    {
      name: "Profile",
      path: "/owner/profile",
      icon: <User size={iconSize} />,
    },
  ];

  const menuItems = user?.role === "user" ? userMenuItems : ownerMenuItems;

  return (
    <aside className="w-64 h-screen bg-card border-r border-border fixed left-0 top-0 pt-20 flex flex-col">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => {
              navigate(item.path);
            }}
            className={`p-4 flex items-center gap-3 cursor-pointer rounded-lg transition-colors ${
              pathname === item.path
                ? "bg-black text-white"
                : "hover:bg-black/10 text-foreground"
            }`}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.name}</span>
          </div>
        ))}
      </nav>
      
      <div className="px-4 py-6 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          <LogOut size={iconSize} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default MenuItems;
