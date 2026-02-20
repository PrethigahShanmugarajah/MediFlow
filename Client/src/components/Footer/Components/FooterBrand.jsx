// MediFlow / Client / src / components / Footer / Components / FooterBrand.jsx
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "../../../assets/Logo.png";

const FooterBrand = () => {
  return (
    <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
      <div className="flex items-center space-x-5 mb-6 transform transition-transform duration-500">
        <div className="relative">
          <div className="relative w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 p-1 transform transition-transform duration-500">
            <img
              src={Logo}
              alt={"Medi Flow" || "Logo"}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold bg-linear-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent font-['Poppins'] tracking-tight">
            MediFlow
          </h2>
          <p className="text-indigo-600 font-serif text-xs md:text-sm font-semibold tracking-wide mt-1">
            Your Health, Our Priority
          </p>
        </div>
      </div>

      <p className="text-indigo-700 font-serif italic mb-5 leading-relaxed text-sm md:text-base font-light">
        Trusted specialists delivering quality healthcare with care and
        precision.
      </p>

      <div className="space-y-3 w-full md:w-auto">
        <div className="flex items-center justify-center md:justify-start space-x-4 text-indigo-700 hover:text-indigo-800 transition-all duration-300 group transform hover:translate-x-0 md:hover:translate-x-2">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm">
            <Phone className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-sm font-medium">
            {import.meta.env.VITE_PHONE}
          </span>
        </div>

        <div className="flex items-center justify-center md:justify-start space-x-4 text-indigo-700 hover:text-indigo-800 transition-all duration-300 group transform hover:translate-x-0 md:hover:translate-x-2">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm">
            <Mail className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-sm font-medium">
            {import.meta.env.VITE_EMAIL}
          </span>
        </div>

        <div className="flex items-center justify-center md:justify-start space-x-4 text-indigo-700 hover:text-indigo-800 transition-all duration-300 group transform hover:translate-x-0 md:hover:translate-x-2">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm">
            <MapPin className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-sm font-medium">
            {import.meta.env.VITE_LOCATION}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FooterBrand;
