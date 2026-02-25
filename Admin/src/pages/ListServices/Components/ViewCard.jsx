// MediFlow / Admin / src / pages / ListServices / Components / ViewCard.jsx
import { Calendar, Edit2, Trash2 } from "lucide-react";
import {
  formatDateHuman,
  sortSlotsForDisplay,
} from "../../../utils/listServicesUtils";

const ViewCard = ({ svc, startEdit, onRequestDelete }) => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-md font-bold text-indigo-700">About</h3>
        <p className="text-md text-indigo-500 mt-1">{svc.about}</p>
      </div>

      <div>
        <h3 className="text-md font-bold text-indigo-700">Instructions</h3>
        <ul className="list-disc list-inside text-md text-indigo-500 mt-1 space-y-1">
          {svc.instructions.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-md font-bold text-indigo-700">Slots</h3>
        <div className="mt-2 space-y-2 text-sm text-indigo-600">
          {svc.slots.length === 0 ? (
            <div className="text-indigo-300">No slots scheduled</div>
          ) : (
            sortSlotsForDisplay(svc.slots).map((slot) => (
              <div key={slot.id} className="flex font-bold items-center gap-3">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <div>
                  <div>
                    {formatDateHuman(slot.date)} — {slot.hour}:
                    {String(slot.minute).padStart(2, "0")} {slot.ampm}
                  </div>
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
          <Edit2 className="w-4 h-4 text-indigo-600" />{" "}
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
