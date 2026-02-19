// MediFlow / Admin / src / components / ServiceAppointmentsPage /  components / StatusSelect.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SelectInput } from "../../FormField/FormField";

const StatusSelect = ({ appointment, onChange, disabled }) => {
  const terminal =
    appointment.status === "Completed" || appointment.status === "Canceled";

  const normalizedStatus =
    appointment.status === "Rescheduled"
      ? "Pending"
      : appointment.status || "Pending";

  const { control, setValue } = useForm({
    defaultValues: {
      status: normalizedStatus,
    },
  });

  const options = [
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Completed", label: "Completed" },
    { value: "Canceled", label: "Canceled" },
  ];

  useEffect(() => {
    setValue("status", normalizedStatus);
  }, [normalizedStatus, setValue]);

  return (
    <div className="w-fit">
      <SelectInput
        control={control}
        name="status"
        options={options}
        selectClassName="status-small"
        isDisabled={terminal || disabled}
        disabledVariant="muted"
        onChange={(opt) => {
          if (terminal || disabled) return;

          const value = opt?.value || "Pending";
          setValue("status", value);
          onChange(value);
        }}
      />
    </div>
  );
};

export default StatusSelect;
