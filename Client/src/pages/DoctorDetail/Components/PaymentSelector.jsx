// MediFlow / Client / src / pages / DoctorDetail / Components / PaymentSelector.jsx
import { RadioInput } from "../../../components/FormField/RadioInput";

const PaymentSelector = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <RadioInput
      label="Payment:"
      labelPosition="left"
      name="payment"
      size="md"
      value={paymentMethod}
      onChange={(val) => setPaymentMethod(val)}
      options={[
        { value: "Cash", label: "Cash" },
        { value: "Online", label: "Online" },
      ]}
      className="mb-3"
      labelClassName="text-sm font-medium text-indigo-700"
      groupClassName="flex gap-2"
      optionClassName="px-3 py-1"
    />
  );
};

export default PaymentSelector;
