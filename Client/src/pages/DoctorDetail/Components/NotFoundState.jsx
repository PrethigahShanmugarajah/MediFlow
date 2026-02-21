// MediFlow / Client / src / pages / DoctorDetail / Components / NotFoundState.jsx
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😷</div>
        <h1 className="text-2xl font-bold text-gray-700">Doctor Not Found</h1>
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

export default NotFoundState;
