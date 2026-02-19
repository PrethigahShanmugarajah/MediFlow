// MediFlow / Admin / src / App.jsx
import { ToastContainer } from "react-toastify";
import { Link, Route, Routes } from "react-router-dom";
import Hero from "./pages/Hero/Hero";
import Home from "./pages/Home/Home";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Appointments from "./pages/Appointments/Appointments";
import ServiceDashboard from "./pages/ServiceDashboard/ServiceDashboard";
import AddService from "./pages/AddService/AddService";
import ListService from "./pages/ListService/ListService";
import ServiceAppointments from "./pages/ServiceAppointments/ServiceAppointments";
import { useUser } from "@clerk/clerk-react";
import Navbar from "./components/Navbar/Navbar";

function RequireAuth({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;
  if (!isSignedIn)
    return (
      <div className="min-h-screen font-mono flex items-center justify-center bg-linear-to-br from-blue-50 via-blue-100 to-white px-4">
        <div className="text-center -mt-80">
          <p className="text-indigo-800 font-semibold text-lg sm:text-2xl mb-4 animate-fade-in">
            Please sign in to view this page
          </p>

          <div className="flex justify-center">
            <Link
              to="/"
              className="px-4 py-2 text-sm rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all  duration-300 ease-in-out animate-bounce-subtle"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );

  return children;
}

const App = () => {
  return (
    <>
      <ToastContainer />

      <div className="bg-linear-to-br from-blue-50 via-blue-100 to-white">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Hero />} />

          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />

          <Route
            path="/add"
            element={
              <RequireAuth>
                <Add />
              </RequireAuth>
            }
          />

          <Route
            path="/list"
            element={
              <RequireAuth>
                <List />
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
            path="/list-service"
            element={
              <RequireAuth>
                <ListService />
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
