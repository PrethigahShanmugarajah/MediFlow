// MediFlow / Client / src / components / client / Footer / Footer.jsx
import {
  Activity,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Send,
  Stethoscope,
} from "lucide-react";
import { Logo } from "../../../assets";
import {
  quickLinks,
  services,
  socialLinks,
} from "../../../data/client/footerData";
import "./Footer.css";
import { InputField } from "../../comman/FormField/InputField";

const Footer = () => {
  const PHONE = import.meta.env.VITE_PHONE;
  const EMAIL = import.meta.env.VITE_EMAIL;
  const LOCATION = import.meta.env.VITE_LOCATION;
  const CLIENT = import.meta.env.VITE_CLIENT;

  return (
    <footer className="relative font-serif bg-linear-to-br from-indigo-100 via-white to-blue-100 border-t border-indigo-300 overflow-hidden">
      <div className="absolute top-5 right-5 animate-float hidden md:block">
        <Stethoscope className="w-8 h-8 text-indigo-600" />
      </div>

      <div className="absolute top-1/3 left-5 animate-float hidden md:block footer-activity">
        <Activity className="w-5 h-5 text-blue-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12 mb-10 text-center lg:text-left">
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <div className="flex items-center space-x-5 mb-6 transform transition-transform duration-500">
              <div className="relative">
                <div className="relative w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 p-1 transform transition-transform duration-500">
                  <img
                    src={Logo}
                    alt="MediFlow Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold bg-linear-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent font-['Poppins'] tracking-tight">
                  MediFlow
                </h2>
                <p className="text-indigo-600 font-serif text-xs md:text-sm font-semibold tracking-wide mt-1">
                  Patients’ Health, Our Priority
                </p>
              </div>
            </div>

            <p className="text-indigo-700 font-serif italic mb-5 leading-relaxed text-sm md:text-base font-light">
              Committed to your health, MediFlow delivers reliable medical care
              with advanced technology and a personal touch.
            </p>

            <div className="space-y-3 w-full md:w-auto">
              <div className="flex items-center justify-center md:justify-start space-x-4 text-indigo-700 hover:text-indigo-800 transition-all duration-300 group transform hover:translate-x-0 md:hover:translate-x-2">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm">
                  <Phone className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-medium">{PHONE}</span>
              </div>

              <div className="flex items-center justify-center md:justify-start space-x-4 text-indigo-700 hover:text-indigo-800 transition-all duration-300 group transform hover:translate-x-0 md:hover:translate-x-2">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm">
                  <Mail className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-medium">{EMAIL}</span>
              </div>

              <div className="flex items-center justify-center md:justify-start space-x-4 text-indigo-700 hover:text-indigo-800 transition-all duration-300 group transform hover:translate-x-0 md:hover:translate-x-2">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-medium">{LOCATION}</span>
              </div>
            </div>
          </div>

          {/* -------- Quick Links -------- */}
          <div className="lg:col-span-1">
            <h3 className="text-lg md:text-xl font-bold text-indigo-800 mb-6 relative inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={link.name} className="w-full">
                  <a
                    href={link.href}
                    className="flex items-center justify-center md:justify-start text-indigo-700 hover:text-indigo-800 transition-all duration-300 group text-sm md:text-base font-medium py-2 px-3 rounded-lg hover:bg-indigo-50 border border-transparent hover:border-indigo-200 quick-link"
                  >
                    <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <ArrowRight className="w-3 h-3 text-indigo-600" />
                    </div>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-lg md:text-xl font-bold text-indigo-800 mb-6 relative inline-block">
              Our Services
            </h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={`${service.name}-${index}`}>
                  <a
                    href={service.href}
                    className="flex items-center justify-center md:justify-start text-indigo-700 hover:text-blue-700 transition-all duration-300 group text-sm md:text-base font-medium py-2 px-3 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200"
                  >
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span>{service.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <h3 className="text-lg md:text-xl font-bold text-indigo-800 mb-4">
              Stay Connected
            </h3>
            <p className="text-indigo-700 text-sm md:text-base mb-4 font-light text-center lg:text-left">
              Get the latest health tips, medical news, and wellness advice
              straight to your inbox.
            </p>

            {/* -------- Newsletter Form -------- */}
            <div className="w-full max-w-md">
              <div className="flex flex-col gap-3 lg:hidden">
                <InputField
                  name="footerEmail"
                  type="email"
                  placeholder="Enter your email"
                  size="m"
                  className="w-full"
                  inputClassName=""
                />
                <button className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-linear-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Send className="w-4 h-4" />
                  Subscribe
                </button>
              </div>

              {/* -------- Desktop Newsletter -------- */}
              <div className="relative hidden lg:block">
                <InputField
                  name="footerEmailMobile"
                  type="email"
                  placeholder="Enter your email"
                  size="m"
                  className=""
                  inputClassName=""
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-linear-to-r from-indigo-500 to-blue-600 text-white px-2.5 py-2 rounded-full cursor-pointer transition-all duration-300 flex items-center shadow-lg hover:shadow-xl">
                  <Send className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Subscribe</span>
                </button>
              </div>

              {/* -------- Social Icons -------- */}
              <div className="flex gap-3 justify-center lg:justify-start mt-6">
                {socialLinks.map(({ Icon, color, name, href }, index) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group social-icon"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-400 to-blue-500 rounded-full transform scale-0 group-hover:scale-110 transition-transform duration-300 hidden lg:block" />
                    <Icon
                      className={`w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 p-2 text-indigo-700 cursor-pointer transform hover:scale-110 hover:rotate-6 transition-all duration-300 relative z-10 bg-white rounded-2xl shadow-lg border-2 border-indigo-100 ${color}`}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center lg:justify-between items-center gap-4 md:gap-6 border-t border-indigo-100 pt-6">
          <div className="text-indigo-700 text-sm md:text-base font-medium flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} MediFlow Healthcare.</span>
          </div>

          <div className="text-indigo-700 text-sm md:text-base font-medium flex items-center gap-2">
            <span>Designed by</span>
            <a
              href={CLIENT}
              target="_blank"
              className="font-bold text-indigo-500 hover:text-violet-700 transition-colors duration-300"
            >
              MediFlow
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
