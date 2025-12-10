import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "@/pages/public/home";
import Loginpage from "./pages/public/login";
import Registerpage from "./pages/public/register";
import UserDashboardPage from "./pages/private/user/dashboard";
import OwnerDashboardPage from "./pages/private/owner/owner/dashboard/page";
import PrivateLayout from "./private-layout";
import PublicLayout from "./public-layout";
import ErrorBoundary from "./components/ErrorBoundary";
import OwnerProfilePage from "./pages/private/owner/profile";
import UserProfilePage from "./pages/private/user/dashboard/Profile";
import { Toaster } from 'sonner';

import "./index.css";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          richColors
        />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<PublicLayout><Homepage/></PublicLayout>}></Route>
          <Route path="/login" element={<PublicLayout><Loginpage/></PublicLayout>}></Route>
          <Route path="/register" element={<PublicLayout><Registerpage/></PublicLayout>}></Route>
          <Route path="/user/dashboard" element={<ErrorBoundary><PrivateLayout><UserDashboardPage/></PrivateLayout></ErrorBoundary>}></Route>
          <Route path="/owner/dashboard" element={<ErrorBoundary><PrivateLayout><OwnerDashboardPage/></PrivateLayout></ErrorBoundary>}></Route>
          <Route path="/owner/profile" element={<ErrorBoundary><PrivateLayout><OwnerProfilePage/></PrivateLayout></ErrorBoundary>}></Route>
          <Route path="/user/profile" element={<ErrorBoundary><PrivateLayout><UserProfilePage/></PrivateLayout></ErrorBoundary>}></Route>

  </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
