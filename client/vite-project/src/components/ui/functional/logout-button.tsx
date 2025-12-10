import Cookies from "js-cookie";
import { Button } from "../button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useUsersStore from "@/store/users-store";

function LogoutButton() {
  const navigate = useNavigate();
  const setUser = useUsersStore((state) => state.setUser);

  const handleLogout = () => {
    try {
      Cookies.remove("token");
      Cookies.remove("role");
      setUser(null); // Clear user from store
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "An error occurred while logging out.");
    }
  };
  
  return (
    <Button className="w-max" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;