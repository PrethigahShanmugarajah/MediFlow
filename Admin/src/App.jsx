import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import { Link, Route, Routes } from "react-router-dom";
import Hero from "./pages/Hero/View/Hero";
import Dashboard from "./pages/Dashboard/View/Dashboard";
import AddDoctor from "./pages/AddDoctor/View/AddDoctor";
import ListDoctors from "./pages/ListDoctors/View/ListDoctors";
import Appointments from "./pages/Appointments/View/Appointments";
import ServiceDashboard from "./pages/ServiceDashboard/View/ServiceDashboard";
import AddService from "./pages/AddService/View/AddService";
import ListServices from "./pages/ListServices/View/ListServices";
import ServiceAppointments from "./pages/ServiceAppointments/View/ServiceAppointments";
import { useUser } from "@clerk/clerk-react";

function RequireAuth({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;
  if (!isSignedIn)
    return (
      <div className="min-h-screen font-mono flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-blue-100 px-4">
        <div className="text-center">
          <p className="text-indigo-800 font-semibold text-lg sm:text-2xl mb-4 animate-fade-in">
            Please sign in to view this page
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            to="/"
            className="px-4 py-2 text-sm rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all duration-300 ease-in-out animate-bounce"
          >
            Home
          </Link>
        </div>
      </div>
    );

  return children;
}

const App = () => {
  return (
    <>
      <ToastContainer />

      <div className="bg-linear-to-br from-indigo-100 via-white to-blue-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/add-doctor"
            element={
              <RequireAuth>
                <AddDoctor />
              </RequireAuth>
            }
          />

          <Route
            path="/list-doctors"
            element={
              <RequireAuth>
                <ListDoctors />
              </RequireAuth>
            }
          />

          <Route
            path="/appointments"
            element={
              <RequireAuth>
                <Appointments />
              </RequireAuth>
            }
          />

          <Route
            path="/service-dashboard"
            element={
              <RequireAuth>
                <ServiceDashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/add-service"
            element={
              <RequireAuth>
                <AddService />
              </RequireAuth>
            }
          />

          <Route
            path="/list-services"
            element={
              <RequireAuth>
                <ListServices />
              </RequireAuth>
            }
          />

          <Route
            path="/service-appointments"
            element={
              <RequireAuth>
                <ServiceAppointments />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
