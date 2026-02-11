// MediFlow / Admin / src / App.jsx
import React from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Hero from "./pages/Hero/Hero";
import Home from "./pages/Home/Home";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Appointments from "./pages/Appointments/Appointments";
import ServiceDashboard from "./pages/ServiceDashboard/ServiceDashboard";
import AddService from "./pages/AddService/AddService";
import ListService from "./pages/ListService/ListService";
import ServiceAppointments from "./pages/ServiceAppointments/ServiceAppointments";

const App = () => {
  return (
    <>
      <ToastContainer />

      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/list" element={<List />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/service-dashboard" element={<ServiceDashboard />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="/list-service" element={<ListService />} />
        <Route path="/service-appointments" element={<ServiceAppointments />} />
      </Routes>
    </>
  );
};

export default App;
