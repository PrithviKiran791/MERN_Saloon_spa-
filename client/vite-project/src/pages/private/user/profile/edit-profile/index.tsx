import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import PageTitle from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { useUsersStore, type IUsersStore } from "@/store/users-store";
import { backendUrl } from "@/constants";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function EditUserProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useUsersStore() as IUsersStore;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const response = await axios.put(
        `${backendUrl}/users/update-profile`,
        data,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
        toast.success("Profile updated successfully");
        setTimeout(() => navigate("/user/profile"), 1500);
      }
    } catch (error: any) {
      console.error("Update error:", error.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <PageTitle title="Edit Profile" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
          <div>
            <Label htmlFor="name" className="text-sm font-semibold text-black">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="mt-2 border-gray-300 focus:border-black focus:ring-black"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.name.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-black">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-2 border-gray-300 focus:border-black focus:ring-black"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex gap-3 mt-8 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white hover:bg-black/80"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner />
                  <span>Updating...</span>
                </div>
              ) : (
                "Update Profile"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/user/profile")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserProfilePage;
