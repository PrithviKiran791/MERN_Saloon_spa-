import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "@/pages/public/home";
import Loginpage from "./pages/public/login";
import Registerpage from "./pages/public/register";
import UserDashboardPage from "./pages/private/user/dashboard";
import UserAppointmentsPage from "./pages/private/user/appointments";
import UserSalonsPage from "./pages/private/user/salons/page";
import BookAppointmentPage from "./pages/private/user/book-appointment";
import UserProfilePage from "./pages/private/user/profile";
import EditUserProfilePage from "./pages/private/user/profile/edit-profile";
import OwnerDashboardPage from "./pages/private/owner/owner/dashboard/page";
import PrivateLayout from "./private-layout";
import PublicLayout from "./public-layout";
import ErrorBoundary from "./components/ErrorBoundary";
import OwnerProfilePage from "./pages/private/owner/profile";
import OwnerSalonsPage from "./pages/private/owner/salons";
import AddSalonPage  from "./pages/private/owner/add-salon";
import EditSalonPage from "./pages/private/owner/edit-salon";
import OwnerAppointmentsPage from "./pages/private/owner/appointments";
import OwnerCustomersPage from "./pages/private/owner/customers";
import SalonDetailPage from "./pages/public/salon-detail";
import SalonsListPage from "./pages/public/salons-list";
import ChangePasswordPage from "./pages/private/user/dashboard/change-password";
import EditOwnerProfilePage from "./pages/private/owner/profile/edit-profile";
import ChangeOwnerPasswordPage from "./pages/private/owner/profile/change-password";
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
          <Route path="/salons" element={<PublicLayout><SalonsListPage /></PublicLayout>} />
          <Route path="/salons/:id" element={<PublicLayout><SalonDetailPage/></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Loginpage/></PublicLayout>}></Route>
          <Route path="/register" element={<PublicLayout><Registerpage/></PublicLayout>}></Route>
          <Route path="/user/dashboard" element={<ErrorBoundary><PrivateLayout><UserDashboardPage/></PrivateLayout></ErrorBoundary>}></Route>
          <Route path="/user/appointments" element={<ErrorBoundary><PrivateLayout><UserAppointmentsPage/></PrivateLayout></ErrorBoundary>} />
          <Route path="/user/salons" element={<ErrorBoundary><PrivateLayout><UserSalonsPage /></PrivateLayout></ErrorBoundary>} />
          <Route path="/user/salons/book-appointment/:id" element={<ErrorBoundary><PrivateLayout><BookAppointmentPage /></PrivateLayout></ErrorBoundary>} />
          <Route path="/user/profile" element={<ErrorBoundary><PrivateLayout><UserProfilePage/></PrivateLayout></ErrorBoundary>}></Route>
          <Route path="/user/profile/edit-profile" element={<ErrorBoundary><PrivateLayout><EditUserProfilePage/></PrivateLayout></ErrorBoundary>}></Route>
          <Route path="/user/dashboard/change-password" element={<ErrorBoundary><PrivateLayout><ChangePasswordPage/></PrivateLayout></ErrorBoundary>}></Route>
          <Route path="/owner/dashboard" element={<ErrorBoundary><PrivateLayout><OwnerDashboardPage/></PrivateLayout></ErrorBoundary>}></Route>
          <Route path="/owner/profile" element={<ErrorBoundary><PrivateLayout><OwnerProfilePage/></PrivateLayout></ErrorBoundary>}></Route>
          <Route path="/owner/profile/edit-profile" element={<ErrorBoundary><PrivateLayout><EditOwnerProfilePage/></PrivateLayout></ErrorBoundary>}></Route>
          <Route path="/owner/profile/change-password" element={<ErrorBoundary><PrivateLayout><ChangeOwnerPasswordPage/></PrivateLayout></ErrorBoundary>}></Route>
          <Route path="/owner/salons" element={<ErrorBoundary><PrivateLayout><OwnerSalonsPage /></PrivateLayout></ErrorBoundary>} />
          <Route path="/owner/salons/add" element={<ErrorBoundary><PrivateLayout><AddSalonPage /></PrivateLayout></ErrorBoundary>} />
          <Route path="/owner/salons/edit/:id" element={<ErrorBoundary><PrivateLayout><EditSalonPage /></PrivateLayout></ErrorBoundary>} />
          <Route path="/owner/appointments" element={<ErrorBoundary><PrivateLayout><OwnerAppointmentsPage /></PrivateLayout></ErrorBoundary>} />
          <Route path="/owner/customers" element={<ErrorBoundary><PrivateLayout><OwnerCustomersPage /></PrivateLayout></ErrorBoundary>} />
  </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
