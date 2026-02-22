// MediFlow / Admin / src / pages / AddDoctor / Components / SlotList.jsx
import { Trash2 } from "lucide-react";
import { formatDateISO } from "../../../utils/addDoctorUtils";

const SlotList = ({ schedule, getFlatSlots, onRemove, className = "" }) => {
  const slots = getFlatSlots(schedule);

  if (!slots.length) return null;

  return (
    <div
      className={`mt-4 space-y-2 max-w-9xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-3 gap-4 ${className}`}
    >
      {slots.map(({ date, time }) => (
        <div
          key={date + time}
          className="flex justify-between items-center bg-indigo-50 p-3 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md text-indigo-800 "
        >
          <span>
            {formatDateISO(date)} — {time}
          </span>

          <button
            onClick={() => onRemove(date, time)}
            className="text-red-500"
            aria-label={`Remove slot ${date} ${time}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SlotList;
