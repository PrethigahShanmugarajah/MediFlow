import { Edit2, MapPin, Stethoscope, X } from "lucide-react";
import { capitalizeWords, formatDoctorName } from "../../../../utils/helpers";

const ProfileHeader = ({
  doc,
  editing,
  isAvailable,
  toggleAvailability,
  onToggleEditing,
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-700 to-indigo-900 bg-clip-text text-transparent truncate">
          {formatDoctorName(doc.name)}
        </h1>

        <div className="text-sm sm:text-lg text-indigo-700 mt-2 flex items-center gap-4">
          <div className="flex gap-2 items-center justify-center">
            <Stethoscope className="w-4 h-4" />
            <span>{capitalizeWords(doc.specialization)}</span>
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-indigo-700 self-center"></div>

          <div className="flex gap-2 items-center justify-center">
            <MapPin className="w-4 h-4" />
            <span>{capitalizeWords(doc.location)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={toggleAvailability}
          className={`flex items-center gap-3 px-4 sm:px-5 py-2 rounded-full cursor-pointer border-2 shadow-sm transition-all duration-300 hover:shadow-lg w-full sm:w-auto ${
            isAvailable
              ? "bg-linear-to-r from-indigo-50 to-indigo-100 border-indigo-300 hover:shadow-indigo-200"
              : "bg-linear-to-r from-gray-50 to-gray-100 border-gray-300 hover:shadow-gray-200"
          }`}
        >
          <div
            className={`relative w-10 h-5 rounded-full transition-colors ${
              isAvailable ? "bg-indigo-500" : "bg-gray-400"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                isAvailable ? "left-6" : "left-0.5"
              }`}
            ></div>
          </div>
          <span
            className={`font-medium ${isAvailable ? "text-indigo-700" : "text-gray-600"}`}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </button>

        <button
          onClick={onToggleEditing}
          className="group relative overflow-hidden bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-5 py-2 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] w-full sm:w-auto"
        >
          <div className="relative flex items-center gap-2">
            {editing ? (
              <X className="w-4 h-4" />
            ) : (
              <Edit2 className="w-4 h-4" />
            )}

            <span className="font-medium">
              {editing ? "Cancel" : "Edit Profile"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
