// MediFlow / Client / src / components / common / PatientDetailsForm.jsx
import { InputField } from "./FormField/InputField";
import { SelectInput } from "./FormField/SelectInput";
import { genderOptions } from "../../utils/client/helpers";

const PatientDetailsForm = ({
  formData,
  setFormData,
  handleMobileChange,
  handleMobilePaste,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm">
      <h3 className="text-lg font-semibold text-indigo-700 mb-4">
        Patient Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          name="patientName"
          type="text"
          label="Full Name"
          labelPosition="top"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={(val) => setFormData((p) => ({ ...p, name: val }))}
          size="m"
        />

        <InputField
          name="patientAge"
          type="number"
          label="Age"
          labelPosition="top"
          placeholder="Age"
          required
          min={0}
          value={formData.age}
          onChange={(val) => setFormData((p) => ({ ...p, age: val }))}
          size="m"
        />

        <InputField
          name="patientMobile"
          type="tel"
          label="Mobile Number"
          labelPosition="top"
          placeholder="Mobile Number (10 digits)"
          required
          value={formData.mobile}
          onChange={(val) => handleMobileChange(val)}
          onPaste={handleMobilePaste}
          inputMode="numeric"
          pattern="\d{10}"
          maxLength={10}
          size="m"
        />

        <SelectInput
          label="Gender"
          labelPosition="top"
          options={genderOptions}
          value={formData.gender}
          onChange={(val) => setFormData((p) => ({ ...p, gender: val }))}
          placeholder="Select gender"
          size="lg"
          required
        />

        <div className="md:col-span-2">
          <InputField
            name="patientEmail"
            type="email"
            label="Email (Optional)"
            labelPosition="top"
            placeholder="Enter email for receipt"
            value={formData.email}
            onChange={(val) => setFormData((p) => ({ ...p, email: val }))}
            size="m"
          />
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsForm;
