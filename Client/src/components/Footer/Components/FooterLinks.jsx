// MediFlow / Client / src / components / Footer / Components / FooterLinks.jsx
import { ArrowRight } from "lucide-react";
import { quickLinks } from "../Data/FooterData";

const FooterLinks = () => {
  return (
    <div className="lg:col-span-1">
      <h3 className="text-lg md:text-xl font-bold text-indigo-800 mb-6 relative inline-block">
        Quick Links
      </h3>

      <ul className="space-y-2">
        {quickLinks.map((link, index) => (
          <li key={link.name} className="w-full">
            <a
              href={link.href}
              className="flex items-center justify-center md:justify-start text-indigo-700 hover:text-indigo-800 transition-all duration-300 group text-sm md:text-base font-medium py-2 px-3 rounded-lg hover:bg-indigo-50 border border-transparent hover:border-indigo-200"
              style={{ animationDelay: `${index * 60}ms` }}
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
  );
};

export default FooterLinks;
