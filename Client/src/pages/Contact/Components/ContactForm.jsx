// MediFlow / Client / src / pages / Contact / Components / ContactForm.jsx
import {
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  SendHorizonal,
  Stethoscope,
  User,
} from "lucide-react";
import Title from "../../../components/Title";
import { InputField } from "../../../components/FormField/InputField";
import { SelectInput } from "../../../components/FormField/SelectInput";
import { TextAreaField } from "../../../components/FormField/TextAreaField";
import { ClipLoader } from "react-spinners";

const ContactForm = ({
  form,
  errors,
  sent,
  departments,
  availableServices,
  handleChange,
  handleSubmit,
}) => {
  const departmentOptions = (departments || []).map((d) => ({
    value: d,
    label: d,
  }));

  const serviceOptions = (availableServices || []).map((s) => ({
    value: s,
    label: s,
  }));

  return (
    <div className="relative bg-white/60 backdrop-blur-sm shadow-2xl rounded-3xl border border-emerald-200 p-6 sm:p-8 md:p-10 transition-all">
      <div className="text-center justify-center mb-4">
        <Title
          title="Contact Our Clinic"
          description="Fill the form - we will open WhatsApp so you can connect with us instantly."
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <InputField
              label={
                <span className="inline-flex items-center gap-2 text-emerald-800">
                  <User size={16} /> Full Name
                </span>
              }
              labelPosition="top"
              name="name"
              type="text"
              placeholder="Full Name"
              size="m"
              required
              value={form.name}
              onChange={(val) =>
                handleChange({ target: { name: "name", value: val } })
              }
              error={errors.name}
              inputClassName="-mb-1.5"
              errorClassName="-mb-1"
            />
          </div>

          <InputField
            label={
              <span className="inline-flex items-center gap-2 text-emerald-800">
                <Mail size={16} /> Email
              </span>
            }
            labelPosition="top"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            size="m"
            required
            value={form.email}
            onChange={(val) =>
              handleChange({ target: { name: "email", value: val } })
            }
            error={errors.email}
            inputClassName="-mb-1.5"
            errorClassName="-mb-1"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <InputField
              label={
                <span className="inline-flex items-center gap-2 text-emerald-800">
                  <Phone size={16} /> Phone
                </span>
              }
              labelPosition="top"
              name="phone"
              type="tel"
              placeholder="1234567890"
              size="m"
              required
              value={form.phone}
              onChange={(val) =>
                handleChange({
                  target: {
                    name: "phone",
                    value: val.replace(/\D/g, "").slice(0, 10),
                  },
                })
              }
              maxLength={10}
              inputMode="numeric"
              error={errors.phone}
              inputClassName="-mb-1.5"
              errorClassName="-mb-1"
            />
          </div>

          <div>
            <SelectInput
              label={
                <span className="inline-flex items-center gap-2 text-emerald-800">
                  <MapPin size={16} /> Department
                </span>
              }
              options={departmentOptions}
              placeholder="Select Department"
              size="lg"
              required
              value={form.department}
              onChange={(val) =>
                handleChange({
                  target: { name: "department", value: val },
                })
              }
              error={errors.department}
              errorClassName="-mb-1"
            />
          </div>
        </div>

        <div>
          <SelectInput
            label={
              <span className="inline-flex items-center gap-2 text-emerald-800">
                <Stethoscope size={16} /> Service
              </span>
            }
            options={serviceOptions}
            placeholder="Select Service (or choose Department above)"
            size="lg"
            required
            value={form.service}
            onChange={(val) =>
              handleChange({
                target: { name: "service", value: val },
              })
            }
            error={errors.service}
            errorClassName="-mb-1"
          />
        </div>

        <div>
          <TextAreaField
            label={
              <span className="inline-flex items-center gap-2 text-emerald-800">
                <MessageSquare size={16} /> Message
              </span>
            }
            labelPosition="top"
            name="message"
            placeholder="Describe your concern briefly..."
            rows={4}
            size="m"
            required
            value={form.message}
            onChange={(val) =>
              handleChange({
                target: { name: "message", value: val },
              })
            }
            error={errors.message}
            textareaClassName="-mb-1.5"
            errorClassName="-mb-1"
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="submit"
            className="w-full flex items-center gap-2 justify-center bg-emerald-600 text-white px-5 py-2 rounded-full shadow-lg transition-transform active:scale-95"
          >
            {sent ? (
              <ClipLoader size={20} color="#FFFFFF" />
            ) : (
              <>
                <SendHorizonal size={18} />
                <span>Send via WhatsApp</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
