import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "@/pages/public/home";
import Loginpage from "./pages/public/login";
import Registerpage from "./pages/public/register";
import UserDashboardPage from "./pages/private/user/dashboard";
import OwnerDashboardPage from "./pages/private/owner/owner/dashboard/page";
import PrivateLayout from "./private-layout";
import PublicLayout from "./public-layout";
import { Toaster } from 'sonner';

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        richColors
      />
      <Routes>
        <Route path="/home" element={<PublicLayout><Homepage/></PublicLayout>}></Route>
        <Route path="/login" element={<PublicLayout><Loginpage/></PublicLayout>}></Route>
        <Route path="/register" element={<PublicLayout><Registerpage/></PublicLayout>}></Route>
        <Route path="/user/dashboard" element={<PrivateLayout><UserDashboardPage/></PrivateLayout>}></Route>
        <Route path="/owner/dashboard" element={<PrivateLayout><OwnerDashboardPage/></PrivateLayout>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
