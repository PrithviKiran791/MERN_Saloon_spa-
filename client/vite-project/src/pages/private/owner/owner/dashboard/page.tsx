import useUsersStore from "@/store/users-store";
import LogoutButton from "@/components/ui/functional/logout-button";

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
    <div className="flex flex-col gap-5">
      <div className="bg-card p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
        <h2 className="text-lg font-semibold">User Information</h2>
        <div className="space-y-2">
          <p>
            <strong>User ID:</strong> {user._id}
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}

export default OwnerDashboardPage;