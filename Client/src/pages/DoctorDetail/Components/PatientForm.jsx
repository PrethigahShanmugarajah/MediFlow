// MediFlow / Client / src / pages / DoctorDetail / Components / PatientForm.jsx
import { InputField } from "../../../components/FormField/InputField";
import { SelectInput } from "../../../components/FormField/SelectInput";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

const PatientForm = ({
  formData,
  setFormData,
  onMobileChange,
  onMobilePaste,
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
          placeholder="Full Name"
          value={formData.name}
          onChange={(val) => setFormData((prev) => ({ ...prev, name: val }))}
          inputClassName="border border-indigo-200"
        />

        <InputField
          name="patientAge"
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(val) => setFormData((prev) => ({ ...prev, age: val }))}
          inputClassName="border border-indigo-200"
        />

        <InputField
          name="patientMobile"
          type="tel"
          inputMode="numeric"
          pattern="\d{10}"
          maxLength={10}
          placeholder="Mobile Number (10 digits)"
          value={formData.mobile}
          onChange={(val) => onMobileChange(val)}
          onPaste={onMobilePaste}
          inputClassName=""
        />

        <SelectInput
          label={null}
          options={genderOptions}
          placeholder="Select Gender"
          value={formData.gender}
          onChange={(val) => setFormData((prev) => ({ ...prev, gender: val }))}
          size="lg"
        />

        <div className="md:col-span-2">
          <InputField
            name="patientEmail"
            type="email"
            placeholder="Email (optional - for receipts)"
            value={formData.email}
            onChange={(val) => setFormData((prev) => ({ ...prev, email: val }))}
            inputClassName=""
          />
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
