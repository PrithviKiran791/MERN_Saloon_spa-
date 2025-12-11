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
import { backendUrl } from "@/constants";

const passwordSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

function ChangeOwnerPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const response = await axios.put(
        `${backendUrl}/users/change-password`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Password changed successfully");
        reset();
        setTimeout(() => navigate("/owner/profile"), 1500);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white to-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <PageTitle title="Change Password" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
          <div>
            <Label htmlFor="oldPassword" className="text-sm font-semibold text-black">
              Current Password
            </Label>
            <Input
              id="oldPassword"
              type="password"
              placeholder="Enter your current password"
              className="mt-2 border-gray-300 focus:border-black focus:ring-black"
              {...register("oldPassword")}
            />
            {errors.oldPassword && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.oldPassword.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="newPassword" className="text-sm font-semibold text-black">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              className="mt-2 border-gray-300 focus:border-black focus:ring-black"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-black">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              className="mt-2 border-gray-300 focus:border-black focus:ring-black"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.confirmPassword.message}
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
                "Change Password"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/owner/profile")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeOwnerPasswordPage;
