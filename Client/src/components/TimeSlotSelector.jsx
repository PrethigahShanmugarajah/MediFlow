// MediFlow / Client / src / components / TimeSlotSelector.jsx
import { Clock } from "lucide-react";

const TimeSlotSelector = ({
  slots = [],
  selectedSlot,
  onSelectSlot,
  bookedSlots = [],
  hideBooked = false,
}) => {
  const bookedSet = new Set((bookedSlots || []).map((s) => String(s).trim()));

  const visibleSlots = hideBooked
    ? slots.filter((s) => !bookedSet.has(String(s).trim()))
    : slots;

  return (
    <div className="space-y-1 space-x-1 gap-3 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3">
      {visibleSlots.length === 0 && (
        <p className="text-gray-500">No available time slots for this date.</p>
      )}

      {visibleSlots.map((slot) => {
        const isSelected = selectedSlot === slot;
        const isBooked = bookedSet.has(String(slot).trim());
        const disabled = isBooked;

        return (
          <button
            key={slot}
            onClick={() => {
              if (disabled) return;
              onSelectSlot(slot);
            }}
            className={`min-w-35 p-2 rounded-full border-2 transition-all ${
              disabled
                ? "bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed opacity-70"
                : isSelected
                  ? "bg-linear-to-br from-indigo-500 to-blue-500 text-white border-indigo-500"
                  : "bg-white text-black border-indigo-100 hover:border-indigo-300"
            }`}
            title={disabled ? "Already booked" : "Select time slot"}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{slot}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotSelector;
