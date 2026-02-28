// MediFlow / Client / src / App.jsx
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

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const App = () => {
  return (
    <>
      <ToastContainer />

      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/doctors"
          element={
            <Layout>
              <Doctors />
            </Layout>
          }
        />
        <Route
          path="/services"
          element={
            <Layout>
              <Service />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/appointments"
          element={
            <Layout>
              <Appointments />
            </Layout>
          }
        />
        <Route
          path="/appointment/success"
          element={
            <Layout>
              <VerifyPayment />
            </Layout>
          }
        />
        <Route
          path="/appointment/cancel"
          element={
            <Layout>
              <VerifyPayment />
            </Layout>
          }
        />
        <Route
          path="/service-appointment/success"
          element={
            <Layout>
              <VerifyServicePayment />
            </Layout>
          }
        />
        <Route
          path="/service-appointment/cancel"
          element={
            <Layout>
              <VerifyServicePayment />
            </Layout>
          }
        />

        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/services/:id" element={<ServiceDetail />} />

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
