import type { IUsersStore } from "@/store/users-store";
import useUsersStore from "@/store/users-store";
import { Avatar } from "@/components/ui/avatar";
import logoImage from "@/assets/logo.png";
import SplitFlapText from "@/components/ui/split-flap-text";

function Header(){
    const { user } = useUsersStore() as IUsersStore;

    return (
        <header className="private-header fixed inset-x-0 top-0 z-40 flex min-h-16 items-center justify-between bg-[#171717] px-4 py-3 text-white shadow-md md:px-8">
            <div className="flex items-center gap-3">
                <img src={logoImage} alt="S.H.E.Y salon logo" className="size-10 rounded-full bg-white object-contain p-1" />
                <div className="min-w-28">
                    <SplitFlapText
                        words={["S.H.E.Y"]}
                        flipDuration={0.12}
                        stagger={0.06}
                        cycleDelay={2400}
                        tileColor="#111111"
                        textColor="#f8fafc"
                        tileRadius={4}
                        gap={3}
                        fontSize={24}
                        padTo={7}
                        className="header-flap-brand"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Avatar size="sm" initials={user?.name?.slice(0, 2).toUpperCase()} status="online" border />
                <h1 className="text-sm text-white font-medium">
                    Welcome, {user?.name}
                </h1>
            </div>
        </header>
    );
}

export default Header;