// MediFlow / Client / src / App.jsx
import React from "react";
import { ToastContainer } from "react-toastify";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Doctors from "./pages/Doctors/Doctors";
import DoctorDetail from "./pages/DoctorDetail/DoctorDetail";
import Service from "./pages/Service/Service";
import ServiceDetail from "./pages/ServiceDetail/ServiceDetail";
import Contact from "./pages/Contact/Contact";
import Appointments from "./pages/Appointments/Appointments";
import VerifyPayment from "./pages/VerifyPayment/VerifyPayment";
import VerifyServicePayment from "./pages/VerifyServicePayment/VerifyServicePayment";
import DoctorNavbar from "./Doctors/components/DoctorNavbar/DoctorNavbar";
import Login from "./pages/Login/Login";
import DoctorHome from "./Doctors/pages/DoctorHome/DoctorHome";
import DoctorList from "./Doctors/pages/DoctorList/DoctorList";
import DoctorEditProfile from "./Doctors/pages/DoctorEditProfile/DoctorEditProfile";

const isDoctorLoggedIn = () => {
  return false;
};

const App = () => {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/doctors/:id" element={<DoctorDetail />} />
                <Route path="/services" element={<Service />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route
                  path="/appointment/success"
                  element={<VerifyPayment />}
                />
                <Route path="/appointment/cancel" element={<VerifyPayment />} />
                <Route
                  path="/service-appointment/success"
                  element={<VerifyServicePayment />}
                />
                <Route
                  path="/service-appointment/cancel"
                  element={<VerifyServicePayment />}
                />
              </Routes>
              <Footer />
            </>
          }
        />

        <Route
          path="/doctor-admin/*"
          element={
            isDoctorLoggedIn() ? (
              <>
                <DoctorNavbar />
                <Routes>
                  <Route path="login" element={<Login />} />
                  <Route path=":id" element={<DoctorHome />} />
                  <Route path=":id/appointments" element={<DoctorList />} />
                  <Route
                    path=":id/profile/edit"
                    element={<DoctorEditProfile />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/doctor-admin/login" />}
                  />
                </Routes>
              </>
            ) : (
              <Navigate to="/doctor-admin/login" />
            )
          }
        />
      </Routes>
    </>
  );
};

export default App;
