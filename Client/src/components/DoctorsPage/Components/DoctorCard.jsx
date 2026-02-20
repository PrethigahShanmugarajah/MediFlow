// MediFlow / Client / src / components / DoctorsPage / Components / DoctorCard.jsx
import { ChevronRight, Medal, MousePointer2Off } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor, index }) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 md:p-6 text-center transition-all duration-300 hover:shadow-xl animate-fade-in-up ${
        !doctor.available ? "opacity-80" : ""
      }`}
      style={{ animationDelay: `${index * 90}ms` }}
      role="article"
    >
      {doctor.available ? (
        <Link
          to={`/doctors/${doctor.id}`}
          state={{ doctor: doctor.raw || doctor }}
          className="focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-full"
        >
          <div className="relative mx-auto mb-4 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
            <img
              src={doctor.image || "/placeholder-doctor.jpg"}
              alt={doctor.name}
              loading="lazy"
              className="w-full h-full rounded-full object-cover border-4 border-indigo-200 shadow-lg transform transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder-doctor.jpg";
              }}
            />
          </div>
        </Link>
      ) : (
        <div className="relative mx-auto mb-4 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 opacity-70 cursor-not-allowed">
          <img
            src={doctor.image || "/placeholder-doctor.jpg"}
            alt={doctor.name}
            loading="lazy"
            className="w-full h-full rounded-full object-cover border-4 border-gray-200 shadow-lg"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder-doctor.jpg";
            }}
          />
        </div>
      )}

      <h3 className="text-base sm:text-lg whitespace-nowrap lg:text-lg font-bold text-indigo-900 mb-1">
        {doctor.name}
      </h3>

      <p className="text-sm text-indigo-600 font-medium mb-3">
        {doctor.specialization}
      </p>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-indigo-50 border border-indigo-300 shadow-sm">
        <Medal className="w-4 h-4" />
        <span>{doctor.experience || "-"} years Experience</span>
      </div>

      {doctor.available ? (
        <Link
          to={`/doctors/${doctor.id}`}
          state={{ doctor: doctor.raw || doctor }}
          className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-full font-medium transition-all duration-300 text-sm bg-linear-to-r from-indigo-300 to-fuchsia-500 text-white hover:shadow-lg"
        >
          <ChevronRight className="w-5 h-5" /> Book Now
        </Link>
      ) : (
        <button
          disabled
          className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-full font-medium bg-gray-300 text-gray-600 cursor-not-allowed text-sm"
        >
          <MousePointer2Off className="w-5 h-5" /> Not Available
        </button>
      )}
    </div>
  );
};

export default DoctorCard;
