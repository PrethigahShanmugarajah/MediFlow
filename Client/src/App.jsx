import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/client/Navbar/Navbar";
import Footer from "./components/client/Footer/Footer";
import Home from "./pages/client/Home/View/Home";
import Doctors from "./pages/client/Doctors/View/Doctors";
import DoctorDetail from "./pages/client/DoctorDetail/View/DoctorDetail";
import Service from "./pages/client/Service/View/Service";
import ServiceDetail from "./pages/client/ServiceDetail/View/ServiceDetail";
import Contact from "./pages/client/Contact/View/Contact";
import Appointments from "./pages/client/Appointments/View/Appointments";
import DoctorNavbar from "./components/doctor/DoctorNavbar/DoctorNavbar";
import Login from "./pages/doctor/Login/View/Login";
import DoctorDashboard from "./pages/doctor/DoctorDashboard/View/DoctorDashboard";
import DoctorList from "./pages/doctor/DoctorList/View/DoctorList";
import DoctorEditProfile from "./pages/doctor/DoctorEditProfile/View/DoctorEditProfile";
import { CircleChevronUp } from "lucide-react";
import VerifyCheckoutPayment from "./pages/client/VerifyCheckoutPayment/View/VerifyCheckoutPayment";

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollTop}
      className={`fixed right-4 bottom-6 z-50 w-11 h-11 rounded-full flex items-center justify-center 
      bg-indigo-600 text-white shadow-lg transition-all duration-300 
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} 
      hover:scale-110 hover:shadow-xl`}
      title="Go to top"
    >
      <CircleChevronUp size={22} />
    </button>
  );
};

const isDoctorLoggedIn = () => {
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
      document.documentElement.style.overflowX = "auto";
    };
  }, []);

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
      <ScrollToTop />

      <div className="overflow-x-hidden bg-white text-gray-900">
        <Routes>
          {/* -------- Client Routes -------- */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/services" element={<Service />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/appointments" element={<Appointments />} />

            <Route
              path="/appointment/success"
              element={<VerifyCheckoutPayment />}
            />

            <Route
              path="/appointment/cancel"
              element={<VerifyCheckoutPayment />}
            />

            <Route
              path="/service-appointment/success"
              element={<VerifyCheckoutPayment type="service" />}
            />

            <Route
              path="/service-appointment/cancel"
              element={<VerifyCheckoutPayment type="service" />}
            />
          </Route>

          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/services/:id" element={<ServiceDetail />} />

          {/* -------- Doctor Routes -------- */}
          <Route path="/doctor-admin">
            <Route path="login" element={<Login />} />

            <Route element={<DoctorProtectedRoute />}>
              <Route path=":id" element={<DoctorDashboard />} />
              <Route path=":id/appointments" element={<DoctorList />} />
              <Route path=":id/profile/edit" element={<DoctorEditProfile />} />
            </Route>

            <Route
              path="*"
              element={<Navigate to="/doctor-admin/login" replace />}
            />
          </Route>
        </Routes>
      </div>

      <ScrollButton />
    </>
  );
};

export default App;
