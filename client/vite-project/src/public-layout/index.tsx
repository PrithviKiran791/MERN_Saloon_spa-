import React , { useEffect } from "react";
import Cookies  from "js-cookie";
import { useNavigate } from "react-router-dom";
import { WarpBackground } from "@/components/ui/shadcn-io/warp-background";
import { useRouteLoading } from "@/hooks/useRouteLoading";

function PublicLayout({ children } : {children: React.ReactNode}) {
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
                <WarpBackground
                    perspective={120}
                    beamsPerSide={4}
                    beamSize={6}
                    beamDuration={4.5}
                    className="min-h-full w-full p-0 border-0 rounded-none bg-transparent"
                >
                    <div className="min-h-full" />
                </WarpBackground>
            </div>
            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <div className="spinner w-12 h-12"></div>
            </div>
        </div>
    );
}
return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
            <WarpBackground
                perspective={120}
                beamsPerSide={4}
                beamSize={6}
                beamDuration={4.5}
                className="min-h-full w-full p-0 border-0 rounded-none bg-transparent"
            >
                <div className="min-h-full" />
            </WarpBackground>
            <div className="absolute inset-0 bg-linear-to-b from-black via-slate-900 to-black opacity-70" />
        </div>
        <div className="relative z-10 min-h-screen w-full">
            {children}
        </div>
        {isRouteLoading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center gap-3">
                    <div className="spinner w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-white">Loading...</p>
                </div>
            </div>
        )}
    </div>
);
}
export default PublicLayout 