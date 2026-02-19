// MediFlow / Admin / src / components / ServiceAppointmentsPage /  components / RescheduleButton.jsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getTodayISO, isDateBefore, timePartsToInputValue } from "../Services";
import { InputField } from "../../FormField/FormField";

const RescheduleButton = ({ appointment, onReschedule, disabled }) => {
  const terminal =
    appointment.status === "Completed" || appointment.status === "Canceled";
  const [editing, setEditing] = useState(false);
  const todayISO = getTodayISO();
  const [date, setDate] = useState(appointment.date || todayISO);
  const [time, setTime] = useState(timePartsToInputValue(appointment));

  const { control } = useForm();

  useEffect(() => {
    const baseDate = appointment.date || "";
    const initialDate =
      baseDate && !isDateBefore(baseDate, todayISO) ? baseDate : todayISO;
    setDate(initialDate);
    setTime(timePartsToInputValue(appointment));
  }, [
    appointment.date,
    appointment.hour,
    appointment.minute,
    appointment.ampm,
  ]);

  function save() {
    if (!date || !time) return;
    if (isDateBefore(date, getTodayISO())) {
      alert("Please choose today or a future date for rescheduling.");
      return;
    }
    onReschedule(date, time);
    setEditing(false);
  }

  function cancel() {
    const baseDate = appointment.date || "";
    const restoreDate =
      baseDate && !isDateBefore(baseDate, getTodayISO())
        ? baseDate
        : getTodayISO();
    setDate(restoreDate);
    setTime(timePartsToInputValue(appointment));
    setEditing(false);
  }

  return (
    <div className="w-full">
      {!editing ? (
        <div className="flex justify-end">
          <button
            onClick={() => setEditing(true)}
            disabled={terminal || disabled}
            title={
              terminal ? "Cannot reschedule completed/canceled" : "Reschedule"
            }
            className={`text-sm px-3 py-1 rounded-full border transition ${
              terminal
                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-indigo-800 border-indigo-400 hover:shadow-sm cursor-pointer"
            }`}
          >
            Reschedule
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row xl:flex-col md:flex-col md:items-end gap-2 bg-gray-50 p-2 rounded-md shadow-sm">
          <InputField
            control={control}
            name="rescheduleDate"
            type="date"
            inputClassName="text-sm py-1 sm:w-auto"
            rules={{
              required: "Date is required",
            }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={getTodayISO()}
          />

          <InputField
            control={control}
            name="rescheduleTime"
            type="time"
            inputClassName="text-sm py-1 sm:w-auto"
            rules={{
              required: "Time is required",
            }}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={save}
              className="flex-1 sm:flex-none px-3 py-1 bg-blue-500 text-white border border-indigo-500 rounded-full text-sm"
            >
              Save
            </button>

            <button
              onClick={cancel}
              className="flex-1 sm:flex-none px-3 py-1 text-sm bg-rose-500 text-white border border-rose-500 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RescheduleButton;
