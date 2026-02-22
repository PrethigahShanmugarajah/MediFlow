// MediFlow / Admin / src / pages / AddDoctor / Components / DoctorBasicFields.jsx
import { Eye, EyeOff } from "lucide-react";
import { InputField } from "../../../components/FormField/InputField";
import { SelectInput } from "../../../components/FormField/SelectInput";
import { TextAreaField } from "../../../components/FormField/TextAreaField";
import { availabilityOptions } from "../../../utils/addDoctorUtils";

const DoctorBasicFields = ({
  form,
  setForm,
  showPassword,
  setShowPassword,
}) => {
  return (
    <>
      <InputField
        name="name"
        type="text"
        label="Full Name"
        labelPosition="top"
        placeholder="Full Name"
        size="m"
        required
        value={form.name}
        onChange={(val) => setForm((p) => ({ ...p, name: val }))}
        className="-mt-3"
      />

      <InputField
        name="specialization"
        type="text"
        label="Specialization"
        labelPosition="top"
        placeholder="Specialization"
        size="m"
        required
        value={form.specialization}
        onChange={(val) => setForm((p) => ({ ...p, specialization: val }))}
        className="-mt-3"
      />

      <InputField
        name="location"
        type="text"
        label="Location"
        labelPosition="top"
        placeholder="Location"
        size="m"
        required
        value={form.location}
        onChange={(val) => setForm((p) => ({ ...p, location: val }))}
        className="-mt-3"
      />

      <InputField
        name="experience"
        type="number"
        label="Experience"
        labelPosition="top"
        placeholder="Experience"
        size="m"
        required
        value={form.experience}
        onChange={(val) => setForm((p) => ({ ...p, experience: val }))}
        min={0}
        className="-mt-3"
      />

      <InputField
        name="qualifications"
        type="text"
        label="Qualifications"
        labelPosition="top"
        placeholder="Qualifications"
        size="m"
        required
        value={form.qualifications}
        onChange={(val) => setForm((p) => ({ ...p, qualifications: val }))}
        className="-mt-3"
      />

      <InputField
        name="fee"
        type="number"
        label="Consultation Fee"
        labelPosition="top"
        placeholder="Consultation Fee"
        size="m"
        required
        value={form.fee}
        min={0}
        onChange={(val) =>
          setForm((p) => ({
            ...p,
            fee: val === "" ? "" : Number(val),
          }))
        }
        className="-mt-3"
      />

      <InputField
        name="rating"
        type="number"
        label="Rating (1.0 - 5.0)"
        labelPosition="top"
        placeholder="Rating (1.0 - 5.0)"
        size="m"
        required
        min={1}
        max={5}
        step={0.1}
        value={form.rating}
        onChange={(val) => {
          if (val === "") {
            setForm((p) => ({ ...p, rating: "" }));
            return;
          }
          const n = Number(val);
          if (Number.isNaN(n)) return;
          const clamped = Math.max(1, Math.min(5, n));
          const fixed = Math.round(clamped * 10) / 10;
          setForm((p) => ({ ...p, rating: fixed }));
        }}
        onBlur={(val) => {
          if (!val) return;
          const n = Number(val);
          if (Number.isNaN(n)) {
            setForm((p) => ({ ...p, rating: "" }));
            return;
          }
          const clamped = Math.max(1, Math.min(5, n));
          setForm((p) => ({ ...p, rating: Number(clamped.toFixed(1)) }));
        }}
        className="-mt-3"
      />

      <InputField
        name="patients"
        type="number"
        label="Patients"
        labelPosition="top"
        placeholder="Patients"
        size="m"
        required
        min={0}
        value={form.patients}
        onChange={(val) =>
          setForm((p) => ({
            ...p,
            patients: val === "" ? "" : Number(val),
          }))
        }
        className="-mt-3"
      />

      <InputField
        name="success"
        type="number"
        label="Success Rate (%)"
        labelPosition="top"
        placeholder="Success Rate"
        size="m"
        required
        min={0}
        max={100}
        value={form.success}
        onChange={(val) => {
          if (val === "") {
            setForm((p) => ({ ...p, success: "" }));
            return;
          }

          const n = Number(val);
          if (Number.isNaN(n)) return;
          const clamped = Math.max(0, Math.min(100, n));
          setForm((p) => ({ ...p, success: clamped }));
        }}
        className="-mt-3"
      />

      <InputField
        name="email"
        type="email"
        label="Doctor Email"
        labelPosition="top"
        placeholder="Doctor Email"
        size="m"
        required
        value={form.email}
        onChange={(val) => setForm((p) => ({ ...p, email: val }))}
        className="-mt-3"
      />

      <div className="relative">
        <InputField
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          labelPosition="top"
          placeholder="******"
          size="m"
          required
          value={form.password}
          onChange={(val) => setForm((p) => ({ ...p, password: val }))}
          className="-mt-3"
        />

        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-4 top-11 -translate-y-1/2 p-2 rounded-full "
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      <SelectInput
        label="Availability"
        size="lg"
        required
        value={form.availability}
        options={availabilityOptions}
        placeholder="Select Availability"
        onChange={(val) => setForm((p) => ({ ...p, availability: val }))}
        className="-mt-3"
      />

      <TextAreaField
        name="about"
        label="About Doctor"
        labelPosition="top"
        placeholder="About Doctor"
        rows={4}
        size="m"
        required
        value={form.about}
        onChange={(val) => setForm((p) => ({ ...p, about: val }))}
        className="md:col-span-2"
      />
    </>
  );
};

export default DoctorBasicFields;
