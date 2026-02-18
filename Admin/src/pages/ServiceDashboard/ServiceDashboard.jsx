// MediFlow / Admin / src / pages / ServiceDashboard / ServiceDashboard.jsx
import Navbar from "../../components/Navbar/Navbar";
import ServiceDashboardPage from "../../components/ServiceDashboardPage/ServiceDashboardPage";

const ServiceDashboard = () => {
  return (
    <div className="bg-linear-to-b from-indigo-50 via-indigo-25 to-white">
      <Navbar />
      <ServiceDashboardPage />
    </div>
  );
};

export default ServiceDashboard;
