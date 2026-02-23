// MediFlow / Admin / src / pages / ListDoctors / Components / DoctorCard.jsx
import { ChevronDown, Star, Trash2, Users } from "lucide-react";
import DoctorExpandedDetails from "./DoctorExpandedDetails";
import { CURRENCY } from "../../../utils/helpers";
import { formatExperience } from "../../../utils/listDoctorsUtils";

const DoctorCard = ({ doc, isOpen, isMobileScreen, onToggle, onDelete }) => {
  const isAvailable = doc.availability === "Available";

  return (
    <article className="bg-linear-to-r from-indigo-100/50 to-white rounded-2xl shadow-md border border-indigo-100 overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 sm:p-4 md:p-5">
        <img
          src={doc.imageUrl || doc.image || ""}
          alt={doc.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-indigo-200 shadow-sm mx-auto sm:mx-0"
        />

        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start items-start justify-between gap-3 w-full">
            <div className="min-w-0 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg md:text-xl text-indigo-800 font-medium truncate">
                  {doc.name}
                </h3>

                <span
                  className={`ml-0 sm:ml-2 mt-2 sm:mt-0 inline-flex items-center gap-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                    isAvailable
                      ? "bg-indigo-50 text-indigo-700"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isAvailable ? "bg-indigo-600" : "bg-rose-600"
                    }`}
                  />
                  {isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="text-sm text-indigo-600 truncate mt-2 sm:mt-1">
                {doc.specialization} • {formatExperience(doc.experience)} years
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3 sm:mt-0 sm:ml-4">
              <div className="text-sm text-indigo-700 flex items-center gap-1">
                <Star size={14} /> {doc.rating}
              </div>

              <button
                onClick={onToggle}
                className={`p-2 rounded-full cursor-pointer bg-white shadow-sm transform transition ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-xs text-indigo-500">Patients</div>
            <div className="text-sm text-indigo-700 font-medium flex items-center gap-2">
              <Users size={14} /> {doc.patients}
            </div>

            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onDelete}
                  className="px-3 py-1 cursor-pointer rounded-full bg-rose-50 text-rose-600 text-xs flex items-center gap-2 transition"
                >
                  <Trash2 size={14} /> Delete
                </button>

                <div className="text-md font-bold text-indigo-700">Fees:</div>
                <div className="text-sm text-indigo-800 font-medium flex items-center gap-1">
                  {CURRENCY} {doc.fee}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <DoctorExpandedDetails doc={doc} isMobileScreen={isMobileScreen} />
      )}
    </article>
  );
};

export default DoctorCard;
