import { useEffect, useMemo, useState } from "react";
import { InputField } from "../common/FormField/InputField";

const RescheduleButton = ({ appointment, onReschedule }) => {
  const terminal =
    appointment?.status === "complete" || appointment?.status === "cancelled";

  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");

  const minDate = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }, []);

  useEffect(() => {
    const apptRaw = appointment?.date ? String(appointment.date) : "";
    const apptDate = apptRaw.slice(0, 10);

    setDate(apptDate && apptDate >= minDate ? apptDate : minDate);
    setTime(appointment?.time || "09:00");
  }, [appointment?.date, appointment?.time, minDate]);

  function save() {
    if (!date || !time) return;
    if (date < minDate) {
      setDate(minDate);
      return;
    }
    onReschedule?.(date, time);
    setEditing(false);
  }

  function cancel() {
    const apptRaw = appointment?.date ? String(appointment.date) : "";
    const apptDate = apptRaw.slice(0, 10);

    setDate(apptDate && apptDate >= minDate ? apptDate : minDate);
    setTime(appointment?.time || "09:00");
    setEditing(false);
  }

  return (
    <div className="w-full">
      {!editing ? (
        <div className="flex justify-end">
          <button
            onClick={() => setEditing(true)}
            disabled={terminal}
            title={
              terminal ? "Cannot reschedule completed/cancelled" : "Reschedule"
            }
            className={`text-xs px-3 py-1 rounded-full border transition ${
              terminal
                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-indigo-800 border-indigo-200 hover:shadow-sm"
            }`}
          >
            Reschedule
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-end gap-2 w-full">
          <InputField
            name="rescheduleDate"
            type="date"
            size="xs"
            value={date}
            min={minDate}
            onChange={(val) => setDate(val)}
            className="w-full sm:w-32 md:w-36"
          />

          <InputField
            name="rescheduleTime"
            type="time"
            size="xs"
            value={time}
            onChange={(val) => setTime(val)}
            className="w-full sm:w-32 md:w-36"
          />

          <div className="flex gap-2">
            <button
              onClick={save}
              className="text-xs px-3 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Save
            </button>

            <button
              onClick={cancel}
              className="text-xs px-3 py-2 rounded-full border border-indigo-200 bg-white text-indigo-800 hover:shadow-sm transition"
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
