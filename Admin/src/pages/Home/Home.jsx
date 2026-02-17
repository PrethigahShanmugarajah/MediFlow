// MediFlow / Admin / src / pages / Home / Home.jsx
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import DashboardPage from "../../components/DashboardPage/DashboardPage";

const Home = () => {
  return (
    <div className="bg-linear-to-br from-blue-50 via-blue-100 to-white">
      <Navbar />
      <DashboardPage />
    </div>
  );
};

export default Home;
