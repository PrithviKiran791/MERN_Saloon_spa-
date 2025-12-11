import useUsersStore from "@/store/users-store";
import { User, Mail, Shield, Hash, Home } from "lucide-react";
import { Link } from "react-router-dom";

function OwnerDashboardPage() {
  const user = useUsersStore((state) => state.user);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner w-12 h-12"></div>
          <p className="text-muted-foreground animate-pulse-slow">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-2">
      {/* Back to Home Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-black">Dashboard</h2>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-black/30 bg-black/5 hover:bg-black/10 text-black text-sm font-medium transition-all hover:scale-105"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-black to-slate-900 rounded-xl shadow-lg p-8 text-white border border-white/10">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-white/70">Manage your salon and appointments from your dashboard</p>
      </div>

      {/* User Information Card */}
      <div className="bg-white/95 rounded-xl shadow-md p-8 border border-black/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black">User Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User ID */}
          <div className="bg-black/5 rounded-lg p-4 border-l-4 border-black">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-black" />
              <p className="text-sm font-semibold text-black/70">User ID</p>
            </div>
            <p className="text-black font-mono text-sm break-all">{user._id}</p>
          </div>

          {/* Name */}
          <div className="bg-black/5 rounded-lg p-4 border-l-4 border-black">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-black" />
              <p className="text-sm font-semibold text-black/70">Name</p>
            </div>
            <p className="text-black font-semibold text-lg">{user.name}</p>
          </div>

          {/* Email */}
          <div className="bg-black/5 rounded-lg p-4 border-l-4 border-black md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-black" />
              <p className="text-sm font-semibold text-black/70">Email Address</p>
            </div>
            <p className="text-black break-all">{user.email}</p>
          </div>

          {/* Role */}
          <div className="bg-black/5 rounded-lg p-4 border-l-4 border-black">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-black" />
              <p className="text-sm font-semibold text-black/70">Account Role</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-black text-white rounded-full text-sm font-semibold capitalize">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboardPage;