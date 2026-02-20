// MediFlow / Client / src / components / Footer / Components / FooterNewsletter.jsx
import { Send } from "lucide-react";
import { socialLinks } from "../Data/FooterData";
import { InputField } from "../../FormField/InputField";

const FooterNewsletter = () => {
  return (
    <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
      <h3 className="text-lg md:text-xl font-bold text-indigo-800 mb-4">
        Stay Connected
      </h3>

      <p className="text-indigo-700 text-sm md:text-base mb-4 font-light text-center lg:text-left">
        Subscribe for health tips, medical updates, and wellness insights
        delivered to your inbox.
      </p>

      <div className="w-full max-w-md">
        <div className="flex flex-col gap-3 lg:hidden">
          <InputField
            name="newsletterEmail"
            type="email"
            placeholder="Enter your email"
            unstyled={false}
            inputClassName=""
          />

          <button className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-linear-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            <Send className="w-4 h-4" />
            Subscribe
          </button>
        </div>

        <div className="relative hidden lg:block">
          <InputField
            name="newsletterEmail"
            type="email"
            placeholder="Enter your email"
            unstyled={false}
            inputClassName="text-sm"
          />

          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-linear-to-r from-indigo-500 to-blue-600 text-white px-4 py-2 rounded-full cursor-pointer transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
          >
            <Send className="w-4 h-4 mr-2" />
            <span className="font-semibold">Subscribe</span>
          </button>
        </div>

        <div className="flex gap-3 justify-center lg:justify-start mt-6">
          {socialLinks.map(({ Icon, color, name, href }, index) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="absolute inset-0 bg-linear-to-r from-indigo-400 to-blue-500 rounded-full transform scale-0 group-hover:scale-110 transition-transform duration-300 hidden lg:block" />
              <Icon
                className={`w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 p-2 text-indigo-700 cursor-pointer transform hover:scale-110 hover:rotate-6 transition-all duration-300 relative z-10 bg-white rounded-2xl shadow-lg border border-indigo-100 ${color}`}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterNewsletter;
