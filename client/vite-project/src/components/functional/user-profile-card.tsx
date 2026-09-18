import useUsersStore, { type IUsersStore } from "@/store/users-store";
import SpecularButton from "@/components/ui/specular-button";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";

function UserProfileCard() {
  const navigate = useNavigate();
  const { user } = useUsersStore() as IUsersStore;

  if (!user) {
    return <div className="p-6 text-center">Loading user profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b pb-4">
          <Avatar size="lg" initials={user.name.slice(0, 2).toUpperCase()} status="online" border />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">User Profile</h2>
            <p className="text-sm text-gray-500">{user.name}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-semibold">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-semibold">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Role:</span>
            <span className="font-semibold capitalize">{user.role}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <SpecularButton
            size="sm"
            className="flex-1"
            onClick={() => {
              if (user.role === "user") {
                navigate("/user/dashboard/edit-profile");
              } else {
                navigate("/owner/profile/edit-profile");
              }
            }}
          >
            Edit Profile
          </SpecularButton>
          <SpecularButton
            size="sm"
            baseColor="#1f2937"
            className="flex-1"
            onClick={() => {
              if (user.role === "user") {
                navigate("/user/dashboard/change-password");
              } else {
                navigate("/owner/profile/change-password");
              }
            }}
          >
            Change Password
          </SpecularButton>
        </div>
      </div>
    </div>
  );
}

export default UserProfileCard;
