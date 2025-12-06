import Cookies from "js-cookie";
import { Button } from "../button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      Cookies.remove("token");
      Cookies.remove("role");
      toast.success("Logged out successfully.");
    } catch (error: any) {
      toast.error(error.message || "An error occured while logging out.");
    }
  };
  return <Button className="w-max" onClick={handleLogout}>LogoutButton</Button>;
}
export default LogoutButton;
