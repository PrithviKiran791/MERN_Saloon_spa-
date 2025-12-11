import useUsersStore, { type IUsersStore } from "@/store/users-store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function UserProfileCard() {
  const navigate = useNavigate();
  const { user } = useUsersStore() as IUsersStore;

  if (!user) {
    return <div className="p-6 text-center">Loading user profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="flex flex-col gap-4">
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800">User Profile</h2>
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
          <Button 
            className="flex-1 bg-black text-white hover:bg-black/90"
            onClick={() => {
              if (user.role === "user") {
                navigate("/user/dashboard/edit-profile");
              } else {
                navigate("/owner/profile/edit-profile");
              }
            }}
          >
            Edit Profile
          </Button>
          <Button 
            className="flex-1 bg-black text-white hover:bg-black/90"
            onClick={() => {
              if (user.role === "user") {
                navigate("/user/dashboard/change-password");
              } else {
                navigate("/owner/profile/change-password");
              }
            }}
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserProfileCard;
