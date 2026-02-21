// MediFlow / Client / src / pages / DoctorDetail / Components / DetailHeader.jsx
import { ArrowLeft, Star } from "lucide-react";
import { Link } from "react-router-dom";

const DetailHeader = ({ rating }) => {
  return (
    <div className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-indigo-100 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-2 xl:px-4 lg:px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="text-sm md:text-2xl lg:text-xl xl:text-2xl whitespace-nowrap font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Doctor Profile
            </h1>
          </div>

          <div className="flex items-center gap-2 px-2 py-2 bg-white rounded-full shadow-sm border border-violet-100">
            <Star className="text-violet-400 fill-current" size={18} />
            <span className="font-semibold text-violet-600">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailHeader;
