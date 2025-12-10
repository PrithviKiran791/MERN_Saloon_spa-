import type { IUsersStore } from "@/store/users-store";
import useUsersStore from "@/store/users-store";

function Header(){
    const { user } = useUsersStore() as IUsersStore;

    return (
        <header className="fixed top-0 left-0 right-0 px-8 py-4 bg-purple-600 flex justify-between items-center z-10">
            <h1 className="text-2xl font-bold text-white">
                S.H.E.Y
            </h1>
            <div className="flex items-center gap-4">
                <h1 className="text-sm text-white font-medium">
                    Welcome, {user?.name}
                </h1>
            </div>
        </header>
    );
}

export default Header;