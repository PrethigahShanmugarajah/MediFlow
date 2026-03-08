import { useEffect, useState } from "react";
import {
  isDateBefore,
  timePartsToInputValue,
} from "../../../utils/serviceAppointmentsUtils";
import { getTodayISO } from "../../../utils/helpers";
import { InputField } from "../../../components/FormField/InputField";
import { toast } from "react-toastify";

const RescheduleButton = ({ appointment, onReschedule, disabled }) => {
  const terminal =
    appointment.status === "Completed" || appointment.status === "Canceled";
  const [editing, setEditing] = useState(false);
  const todayISO = getTodayISO();
  const [date, setDate] = useState(appointment.date || todayISO);
  const [time, setTime] = useState(timePartsToInputValue(appointment));

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
      toast.warn("Please select today or a future date when rescheduling.");
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
            className={`text-sm cursor-pointer px-3 py-1 rounded-full border focus:outline-none transition ${
              terminal
                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-indigo-800 border-indigo-400 hover:shadow-sm"
            }`}
          >
            Reschedule
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row xl:flex-col md:flex-col md:items-end gap-2 bg-gray-50 p-2 rounded-md shadow-sm">
          <InputField
            name={`reschedule-date-${appointment.id}`}
            type="date"
            value={date}
            onChange={(val) => setDate(val)}
            min={getTodayISO()}
            size="s sm:xs md:s lg:s xl:s"
            className="w-full sm:w-36 md:w-40 lg:w-33 xl:w-36"
          />

          <InputField
            name={`reschedule-time-${appointment.id}`}
            type="time"
            value={time}
            onChange={(val) => setTime(val)}
            size="s sm:xs md:s lg:s xl:s"
            className="w-full sm:w-24 md:w-26 lg:w-26 xl:w-26"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={save}
              className="flex-1 sm:flex-none px-3 py-1 bg-blue-500 cursor-pointer text-white border-indigo-500 rounded-full text-sm"
            >
              Save
            </button>

            <button
              onClick={cancel}
              className="flex-1 sm:flex-none px-3 py-1 bg-rose-100 border text-sm cursor-pointer border-rose-500 text-rose-500 rounded-full"
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
