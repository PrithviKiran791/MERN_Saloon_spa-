import useUserGlobalStore, { type IUsersStore } from "@/store/users-store";
import LogoutButton from "@/components/ui/functional/logout-button";

function UserDashboardPage() {
  const { user } = useUserGlobalStore() as IUsersStore;
  if (!user) return <></>;
  return (
    <div className="flex flex-col gap-5">
      UserDashboardPage
      <h1>Dashboard page</h1>
      <h1>UserName : {user._id}</h1>
      <h1>User Name: {user.name}</h1>
      <h1>User Email:{user.email}</h1>
      <h1>User Role: {user.role}</h1>
      <LogoutButton />
    </div>
  );
}

export default UserDashboardPage;
