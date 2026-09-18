import { backendUrl } from "../constants";
import useUsersStore from "@/store/users-store";
import axios from "axios";
import { useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "./header";
import MenuItems from "./menu-items";
import { useRouteLoading } from "@/hooks/useRouteLoading";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { LoaderOne } from "@/components/ui/loader";

function PrivateLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [loading, setLoading] = useState<boolean>(true);
  const isRouteLoading = useRouteLoading();
  const setUser = useUsersStore((state) => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      let cleanToken: string | undefined;
      try {
        setLoading(true);
        const token = Cookies.get("token");
        
        if (!token) {
          setLoading(false);
          navigate("/login", { replace: true });
          return;
        }
        
        // Trim any whitespace from token
        cleanToken = token.trim();
        
        console.log("Fetching user data with token:", cleanToken.substring(0, 20) + "...");
        console.log("Token length:", cleanToken.length);
        
        const response = await axios.get(`${backendUrl}/users/get-logged-in-user`, {
          headers: {
            Authorization: `Bearer ${cleanToken}`
          }
        });
        
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          toast.error("Failed to fetch user data.");
          Cookies.remove("token");
          Cookies.remove("role");
          navigate("/login", { replace: true });
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        const errorMessage = error?.response?.data?.message || error?.message || "An error occurred while fetching user data.";
        console.error("Error details:", {
          status: error?.response?.status,
          message: errorMessage,
          tokenPresent: !!cleanToken,
          tokenLength: cleanToken?.length
        });
        toast.error(errorMessage);
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          Cookies.remove("token");
          Cookies.remove("role");
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <>
        <AuroraBackground />
        <Header/>
        <MenuItems />
        <div className="flex justify-center items-center h-screen animate-gradient-bg">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md shadow-2xl">
              <LoaderOne />
            </div>
            <p className="text-xs uppercase tracking-widest text-neutral-400 animate-pulse">Loading S.H.E.Y...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent">
      <AuroraBackground />
      <Header />
      <MenuItems />
      
      {/* Route Loading Overlay */}
      {isRouteLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-2xl">
            <LoaderOne />
            <p className="text-xs uppercase tracking-widest text-neutral-300 font-medium">Loading...</p>
          </div>
        </div>
      )}
      
      <div className="private-content relative z-10 ml-20 p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}

export default PrivateLayout;