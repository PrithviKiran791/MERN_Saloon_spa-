import React , { useEffect } from "react";
import Cookies  from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useRouteLoading } from "@/hooks/useRouteLoading";
import { LoaderOne } from "@/components/ui/loader";

function PublicLayout({ children } : Readonly<{children: React.ReactNode}>) {
    const [loading,setloading] = React.useState<boolean>(true);
    const navigate = useNavigate();
    const isRouteLoading = useRouteLoading();
    useEffect(() => {
    if(Cookies.get("token")) {
        const role = Cookies.get('role');
        navigate(`/${role}/dashboard`)

    }
    setloading(false);

    }, []);

    if(loading){
    return (
        <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
                <AuroraBackground className="aurora-background--public" />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md shadow-2xl">
                    <LoaderOne />
                </div>
                <p className="text-xs uppercase tracking-widest text-neutral-400 animate-pulse">Loading S.H.E.Y...</p>
            </div>
        </div>
    );
}
return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
            <AuroraBackground className="aurora-background--public" />
        </div>
        <div className="relative z-10 min-h-screen w-full">
            {children}
        </div>
        {isRouteLoading && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-2xl">
                    <LoaderOne />
                    <p className="text-xs uppercase tracking-widest text-neutral-300 font-medium">Loading...</p>
                </div>
            </div>
        )}
    </div>
);
}
export default PublicLayout 