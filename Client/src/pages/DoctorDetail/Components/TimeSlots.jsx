// MediFlow / Client / src / pages / DoctorDetail / Components / TimeSlots.jsx
import { Clock } from "lucide-react";

const TimeSlots = ({ slots, selectedSlot, onSelect }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
        <Clock className="w-5 h-5" /> Available Time Slots
      </h3>

      <div className="flex gap-3 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3">
        {slots.length === 0 && (
          <p className="text-gray-500">No time slots for this date.</p>
        )}

        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelect(slot)}
            className={`min-w-35 p-2 rounded-full border-2 ${
              selectedSlot === slot
                ? "bg-linear-to-br from-indigo-500 to-indigo-500 text-white border-indigo-500"
                : "bg-white text-gray-700 border-indigo-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{slot}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;
