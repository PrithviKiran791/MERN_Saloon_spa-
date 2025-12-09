import userGlobalStore from "@/store/users-store";
function OwnerDashboardPage() {
    const {user} = userGlobalStore();
    return (
        <div className="flex flex-col gap-5">OwnerDashboardPage
        <h1>Dashboard page</h1>
        <h1>
            UserName : {user._id}
        </h1>
        <h1>
            User Name: {user.name}
        </h1>
        <h1>
            User Email:{user.email}
        </h1>
        <h1>
            User Role: {user.role}
        </h1>
    </div>
    
    )
}

export default OwnerDashboardPage;