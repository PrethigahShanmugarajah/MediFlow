// MediFlow / Client / src / pages / DoctorDetail / Components / Header.jsx
import { ArrowLeft, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Title from "../../../components/Title";

const Header = ({ rating, backTo = "/doctors" }) => {
  return (
    <div className="relative z-10 backdrop-blur-lg top-0">
      <div className="max-w-7xl mx-auto px-4  py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex items-center justify-between">
          <Link
            to={backTo}
            className="inline-flex items-center gap-2 px-2 xl:px-4 lg:px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back</span>
          </Link>

          <div className="flex flex-col items-center gap-1 text-center">
            <Title
              title="Doctor Profile Details"
              description="View doctor details, availability, and book your appointment
                easily."
            />
          </div>

          <div className="flex items-center gap-2 px-2 py-2 bg-white rounded-full shadow-sm border border-sky-100">
            <Star className="text-sky-400 fill-current" size={18} />
            <span className="font-semibold text-sky-600">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
