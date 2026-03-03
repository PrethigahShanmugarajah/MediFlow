// MediFlow / Client / src / App.jsx
import { ToastContainer } from "react-toastify";
import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/client/Navbar/Navbar";
import Footer from "./components/client/Footer/Footer";
import Home from "./pages/client/Home/View/Home";
import Doctors from "./pages/client/Doctors/View/Doctors";
import Service from "./pages/client/Service/View/Service";
import Contact from "./pages/client/Contact/View/Contact";
import Appointments from "./pages/client/Appointments/View/Appointments";
import VerifyPayment from "./pages/client/VerifyPayment/View/VerifyPayment";
import VerifyServicePayment from "./pages/client/VerifyServicePayment/View/VerifyServicePayment";
import DoctorDetail from "./pages/client/DoctorDetail/View/DoctorDetail";
import ServiceDetail from "./pages/client/ServiceDetail/View/ServiceDetail";
import DoctorNavbar from "./components/doctor/DoctorNavbar/DoctorNavbar";
import Login from "./pages/doctor/Login/View/Login";
import DoctorHome from "./pages/doctor/DoctorHome/View/DoctorHome";
import DoctorList from "./pages/doctor/DoctorList/View/DoctorList";
import DoctorEditProfile from "./pages/doctor/DoctorEditProfile/View/DoctorEditProfile";

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
