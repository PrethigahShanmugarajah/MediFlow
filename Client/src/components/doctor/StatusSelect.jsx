// MediFlow / Client / src / components / doctor / StatusSelect.jsx
import { SelectInput } from "../common/FormField/SelectInput";

const StatusSelect = ({ appointment, onChange }) => {
  const terminal =
    appointment.status === "complete" || appointment.status === "cancelled";

  if (appointment.status === "rescheduled") {
    const options = [
      { value: "rescheduled", label: "Rescheduled" },
      { value: "complete", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ];

    return (
      <SelectInput
        options={options}
        value={appointment.status}
        onChange={(val) => onChange(val)}
        isDisabled={terminal}
        size="xxs sm:xs md:xs lg:s"
        className="w-28 sm:w-32 md:w-36 lg:w-40"
        placeholder="Status"
      />
    );
  }

  const options = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "complete", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <SelectInput
      options={options}
      value={appointment.status}
      onChange={(val) => onChange(val)}
      isDisabled={terminal}
      size="xxs sm:xs md:xs lg:s"
      className="w-28 sm:w-32 md:w-36 lg:w-40"
      placeholder="Status"
    />
  );
};

export default StatusSelect;
