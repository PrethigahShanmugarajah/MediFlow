// MediFlow / Client / src / pages / DoctorDetail / Components / ErrorState.jsx
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ErrorState = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-rose-600 mb-2">Error</div>
        <div className="text-gray-700">{error}</div>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all"
        >
          <ArrowLeft size={20} />
          Back to Doctors
        </Link>
      </div>
    </div>
  );
};

export default ErrorState;
