// MediFlow / Admin / src / App.jsx
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Hero from "./pages/Hero/Hero";
import Home from "./pages/Home/Home";
import AddDoctor from "./pages/AddDoctor/AddDoctor";
import ListDoctors from "./pages/ListDoctors/ListDoctors";
import Appointments from "./pages/Appointments/Appointments";
import ServiceDashboard from "./pages/ServiceDashboard/ServiceDashboard";
import AddService from "./pages/AddService/AddService";
import ListServices from "./pages/ListServices/ListServices";
import ServiceAppointments from "./pages/ServiceAppointments/ServiceAppointments";

const App = () => {
  return (
    <>
      <ToastContainer />

      <div className="bg-linear-to-br from-indigo-50 via-white to-blue-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/list-doctors" element={<ListDoctors />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/service-dashboard" element={<ServiceDashboard />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/list-services" element={<ListServices />} />
          <Route
            path="/service-appointments"
            element={<ServiceAppointments />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
