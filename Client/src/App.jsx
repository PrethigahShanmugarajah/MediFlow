// MediFlow / Client / src / App.jsx
import { ToastContainer } from "react-toastify";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";

import Navbar from "./components/client/Navbar/Navbar";
import Footer from "./components/client/Footer/Footer";

import Home from "./pages/client/Home/View/Home";
import Doctors from "./pages/client/Doctors/View/Doctors";
import DoctorDetail from "./pages/client/DoctorDetail/View/DoctorDetail";
import Service from "./pages/client/Service/View/Service";
import ServiceDetail from "./pages/client/ServiceDetail/View/ServiceDetail";
import Contact from "./pages/client/Contact/View/Contact";
import Appointments from "./pages/client/Appointments/View/Appointments";
import VerifyPayment from "./pages/client/VerifyPayment/View/VerifyPayment";
import VerifyServicePayment from "./pages/client/VerifyServicePayment/View/VerifyServicePayment";

import DoctorNavbar from "./components/doctor/DoctorNavbar/DoctorNavbar";
import Login from "./pages/doctor/Login/View/Login";
import DoctorHome from "./pages/doctor/DoctorHome/View/DoctorHome";
import DoctorList from "./pages/doctor/DoctorList/View/DoctorList";
import DoctorEditProfile from "./pages/doctor/DoctorEditProfile/View/DoctorEditProfile";

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;

const isDoctorLoggedIn = () => {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
};

const ClientLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const DoctorLayout = () => (
  <>
    <DoctorNavbar />
    <Outlet />
  </>
);

const DoctorProtectedRoute = () => {
  if (!isDoctorLoggedIn()) return <Navigate to="/doctor-admin/login" replace />;
  return <DoctorLayout />;
};

const App = () => {
  return (
    <>
      <ToastContainer />

      <Routes>
        {/* -------- Client Routes -------- */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/services" element={<Service />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointment/success" element={<VerifyPayment />} />
          <Route path="/appointment/cancel" element={<VerifyPayment />} />

          <Route
            path="/service-appointment/success"
            element={<VerifyServicePayment />}
          />

          <Route
            path="/service-appointment/cancel"
            element={<VerifyServicePayment />}
          />
        </Route>

        {/* -------- Doctor Routes -------- */}
        <Route path="/doctor-admin">
          <Route path="login" element={<Login />} />

          <Route element={<DoctorProtectedRoute />}>
            <Route path=":id" element={<DoctorHome />} />
            <Route path=":id/appointments" element={<DoctorList />} />
            <Route path=":id/profile/edit" element={<DoctorEditProfile />} />
          </Route>

          <Route
            path="*"
            element={<Navigate to="/doctor-admin/login" replace />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
