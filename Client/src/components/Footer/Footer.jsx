// MediFlow / Client / src / components / Footer / Footer.jsx
import { Activity, Hospital } from "lucide-react";
import "./Footer.css";
import FooterBrand from "./Components/FooterBrand";
import FooterLinks from "./Components/FooterLinks";
import FooterServices from "./Components/FooterServices.JSX";
import FooterNewsletter from "./Components/FooterNewsletter";
import FooterBottom from "./Components/FooterBottom";

const Footer = () => {
  return (
    <footer className="relative font-serif bg-linear-to-br from-indigo-50 via-blue-50 to-teal-50 border-t border-indigo-200 overflow-hidden">
      <div className="absolute top-5 right-5 animate-float hidden md:block">
        <Hospital className="w-8 h-8 text-indigo-600" />
      </div>

      <div className="absolute top-1/3 left-5 animate-float hidden md:block activity-delay-3s">
        <Activity className="w-5 h-5 text-blue-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12 mb-10 text-center lg:text-left">
          <FooterBrand />
          <FooterLinks />
          <FooterServices />
          <FooterNewsletter />
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
