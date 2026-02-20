// MediFlow / Client / src / components / Footer / Components / FooterServices.jsx
import { services } from "../Data/FooterData";

const FooterServices = () => {
  return (
    <div className="lg:col-span-1">
      <h3 className="text-lg md:text-xl font-bold text-indigo-800 mb-6 relative inline-block">
        Our Services
      </h3>

      <ul className="space-y-2">
        {services.map((service) => (
          <li key={service.name}>
            <a
              href={service.href}
              className="flex items-center justify-center md:justify-start text-indigo-700 hover:text-blue-700 transition-all duration-300 group text-sm md:text-base font-medium py-2 px-3 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200"
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
              <span>{service.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterServices;
