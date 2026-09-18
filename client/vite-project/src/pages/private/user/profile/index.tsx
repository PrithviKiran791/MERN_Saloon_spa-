import { useNavigate } from "react-router-dom";
import { useUsersStore, type IUsersStore } from "@/store/users-store";
import PageTitle from "@/components/ui/page-title";
import SpecularButton from "@/components/ui/specular-button";
import { Mail, Edit, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { Ripple } from "@/components/ui/ripple";
import { Avatar } from "@/components/ui/avatar";

function UserProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useUsersStore() as IUsersStore;

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <Ripple 
        mainCircleSize={200}
        mainCircleOpacity={0.2}
        numCircles={6}
      />
      <div className="relative z-10">
      <PageTitle title="My Profile" />

      {user && (
        <div className="grid gap-6 mt-6">
          {/* Profile Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar size="xl" initials={user.name.slice(0, 2).toUpperCase()} status="online" border />
                  <div>
                    <h2 className="text-2xl font-bold text-black">{user.name}</h2>
                    <p className="text-gray-600 text-sm capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-semibold">Email Address</p>
                  <p className="text-sm text-black font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <SpecularButton
                size="sm"
                onClick={() => navigate("/user/profile/edit-profile")}
                className="flex-1"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </SpecularButton>
              <SpecularButton
                size="sm"
                onClick={handleLogout}
                baseColor="#1f2937"
                className="flex-1"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </SpecularButton>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Account Information</h3>
            <p className="text-sm text-blue-800">
              You can update your profile information including your name and email address at any time.
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default UserProfilePage;
