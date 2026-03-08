import { Calendar, Edit2, Trash2 } from "lucide-react";
import { sortSlotsForDisplay } from "../../../utils/listServicesUtils";
import { formatDateISO, formatParagraph } from "../../../utils/helpers";

const ViewCard = ({ svc, startEdit, onRequestDelete }) => {
  const groupedSlots = sortSlotsForDisplay(svc.slots).reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];

    acc[slot.date].push(
      `${slot.hour}:${String(slot.minute).padStart(2, "0")} ${slot.ampm}`,
    );

    return acc;
  }, {});

  const slotDates = Object.keys(groupedSlots);

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-md font-bold text-indigo-700">About</h3>
        <p className="text-md text-indigo-500 mt-1">
          {formatParagraph(svc.about)}
        </p>
      </div>

      <div>
        <h3 className="text-md font-bold text-indigo-700">Instructions</h3>
        <ul className="list-disc list-inside text-md text-indigo-500 mt-1 space-y-1">
          {svc.instructions.map((p, i) => (
            <li key={i}>{formatParagraph(p)}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-md font-bold text-indigo-700">Slots</h3>

        <div className="mt-2 space-y-3 text-sm text-indigo-600">
          {slotDates.length === 0 ? (
            <div className="text-indigo-300">No slots scheduled</div>
          ) : (
            slotDates.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-2 text-xs text-indigo-500">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>{formatDateISO(date)}</span>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {groupedSlots[date].map((time, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full border border-indigo-100 shadow-sm"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={() => startEdit(svc)}
          className="inline-flex bg-indigo-200 items-center gap-2 px-3 py-2 rounded-full border border-indigo-300"
        >
          <Edit2 className="w-4 h-4 text-indigo-600" />
          <span className="text-indigo-700">Edit</span>
        </button>

        <button
          onClick={() => onRequestDelete(svc)}
          className="inline-flex items-center bg-rose-200 gap-2 px-3 py-2 rounded-full border text-red-600"
        >
          <Trash2 className="w-4 h-4" /> Remove
        </button>
      </div>
    </div>
  );
};

export default ViewCard;
