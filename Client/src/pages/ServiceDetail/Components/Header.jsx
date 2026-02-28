// MediFlow / Client / src / pages / ServiceDetail / Components / Header.jsx
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Title from "../../../components/Title";

const Header = ({ backTo = "/services", backText = "Back" }) => {
  return (
    <div className="relative z-10 backdrop-blur-lg top-0">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-3 items-center">
          <div className="justify-self-start">
            <Link
              to={backTo}
              className="inline-flex items-center gap-2 px-2 xl:px-4 lg:px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">{backText}</span>
            </Link>
          </div>

          <div className="justify-self-center text-center">
            <Title
              title="Service Profile Details"
              description="View service information, and book your slot easily."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
