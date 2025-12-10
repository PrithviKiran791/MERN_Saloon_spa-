import useUsersStore from "@/store/users-store";
import LogoutButton from "@/components/ui/functional/logout-button";

function UserDashboardPage() {
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
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text text-shadow">User Dashboard</h1>
      </div>
      <div className="bg-card p-6 rounded-lg shadow-soft hover:shadow-hover transition-all-smooth border border-border/50 card-hover">
        <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          User Information
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all-smooth">
            <span className="font-semibold text-muted-foreground min-w-[100px]">User ID:</span>
            <span className="text-foreground font-mono text-sm">{user._id}</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all-smooth">
            <span className="font-semibold text-muted-foreground min-w-[100px]">Name:</span>
            <span className="text-foreground">{user.name}</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all-smooth">
            <span className="font-semibold text-muted-foreground min-w-[100px]">Email:</span>
            <span className="text-foreground">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all-smooth">
            <span className="font-semibold text-muted-foreground min-w-[100px]">Role:</span>
            <span className="badge badge-primary">{user.role}</span>
          </div>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}

export default UserDashboardPage;