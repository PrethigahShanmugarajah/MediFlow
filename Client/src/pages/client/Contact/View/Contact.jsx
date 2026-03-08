import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import "../Contact.css";
import {
  departments,
  genericServices,
  servicesMapping,
} from "../../../../data/client/contactData";
import {
  buildWhatsAppText,
  buildWhatsAppUrl,
  clearDepartmentServiceErrorsIfSelected,
  clearFieldError,
  getAvailableServices,
  getNextFormState,
  validateContactForm,
} from "../../../../utils/client/contactUtils";
import ContactForm from "../Components/ContactForm";
import ClientTitle from "../../../../components/client/ClientTitle";

const Contact = () => {
  const PHONE = import.meta.env.VITE_PHONE;
  const EMAIL = import.meta.env.VITE_EMAIL;
  const LOCATION = import.meta.env.VITE_LOCATION;
  const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || "";
  const CLINIC_HOURS_TEXT =
    import.meta.env.VITE_CLINIC_HOURS_TEXT || "Mon - Sat: 09:00 AM - 06:00 PM";
  const MAP_IFRAME_SRC = import.meta.env.VITE_MAP_IFRAME_SRC || "";

  const initial = {
    name: "",
    email: "",
    phone: "",
    department: "",
    service: "",
    message: "",
  };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  function validate() {
    const e = validateContactForm(form);
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => getNextFormState(prev, name, value));
    setErrors((prev) => {
      const step1 = clearFieldError(prev, name);
      return clearDepartmentServiceErrorsIfSelected(step1, name, value, form);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const text = buildWhatsAppText(form);
    const url = buildWhatsAppUrl(WHATSAPP_PHONE, text);
    window.open(url, "_blank");

    setForm(initial);
    setErrors({});
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  const availableServices = getAvailableServices(
    form.department,
    servicesMapping,
    genericServices,
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-white to-indigo-100 py-12 px-4 sm:px-6 md:px-8 lg:px-20 font-serif relative overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
        {/* -------- Left Side -------- */}
        <ContactForm
          form={form}
          errors={errors}
          sent={sent}
          departments={departments}
          availableServices={availableServices}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />

        {/* -------- Right Side -------- */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-xl border border-indigo-100">
            <div className="text-center -mb-4">
              <ClientTitle title=" Visit Our Clinic" />
            </div>

            <p className="mt-3 flex items-center gap-2 text-sm sm:text-md">
              <MapPin />
              {LOCATION}
            </p>

            <p className="mt-3 flex items-center gap-2 text-sm sm:text-md">
              <Phone size={16} /> {PHONE}
            </p>

            <p className="mt-3 flex items-center gap-2 text-sm sm:text-md">
              <Mail size={16} /> {EMAIL}
            </p>
          </div>

          <iframe
            src={MAP_IFRAME_SRC}
            className="w-full h-56 sm:h-64 md:h-72 lg:h-72 rounded-3xl shadow-2xl border-2 border-indigo-200 hover:shadow-indigo-400 transition-all duration-500"
            title="Gomti Nagar Map"
            loading="lazy"
            allowFullScreen
          ></iframe>

          <div className="bg-linear-to-br from-indigo-100 to-indigo-100 rounded-2xl p-4 shadow-inner border border-indigo-300">
            <h4 className="text-lg sm:text-xl font-semibold mb-1">
              Clinic Hours
            </h4>
            <p className="text-gray-700 text-sm sm:text-md">
              {CLINIC_HOURS_TEXT}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
