import React , { useEffect } from "react";
import Cookies  from "js-cookie";
import { useNavigate } from "react-router-dom";

function PublicLayout({ children } : {children: React.ReactNode}) {
    const [loading,setloading] = React.useState<boolean>(true);
    const navigate = useNavigate();
    useEffect(() => {
    if(Cookies.get("token")) {
        const role = Cookies.get('role');
        navigate(`/${role}/dashboard`)

    }
    setloading(false);

    }, []);

    if(loading){
    return (
        <div className="flex justify-center items-center h-screen">
            {children}
        </div>
    );
}
return <div>{children}</div>;
}
export default PublicLayout 