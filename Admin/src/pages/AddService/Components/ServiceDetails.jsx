// MediFlow / Admin / src / pages / AddService / Components / ServiceDetails.jsx
import { InputField } from "../../../components/FormField/InputField";
import { SelectInput } from "../../../components/FormField/SelectInput";
import { TextAreaField } from "../../../components/FormField/TextAreaField";
import { availabilityOptions } from "../../../utils/addServiceUtils";

const ServiceDetails = ({
  serviceName,
  setServiceName,
  price,
  setPrice,
  availability,
  setAvailability,
  about,
  setAbout,
  errors,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InputField
            label="Service name"
            labelPosition="top"
            name="serviceName"
            type="text"
            size="m"
            required
            placeholder="e.g. General Consultation"
            value={serviceName}
            onChange={(v) => setServiceName(v)}
            error={errors.serviceName ? "Service name is required" : ""}
          />
        </div>

        <div>
          <InputField
            label="Price"
            labelPosition="top"
            name="price"
            type="number"
            size="m"
            required
            placeholder="LKR 499"
            value={price}
            onChange={(v) => setPrice(v)}
            inputMode="numeric"
            error={errors.price ? "Price is required" : ""}
          />

          <div className="mt-3">
            <SelectInput
              label="Availability"
              labelPosition="top"
              size="lg"
              required
              options={availabilityOptions}
              value={availability}
              onChange={(next) => setAvailability(next)}
              error={errors.availability ? "Availability is required." : ""}
            />
          </div>
        </div>
      </div>

      <div>
        <TextAreaField
          label="About this service"
          labelPosition="top"
          name="about"
          size="m"
          rows={5}
          required
          placeholder="Enter a short description about the service"
          value={about}
          onChange={(v) => setAbout(v)}
          error={errors.about ? "About is required." : ""}
        />
      </div>
    </div>
  );
};

export default ServiceDetails;
