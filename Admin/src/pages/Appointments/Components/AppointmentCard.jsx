// MediFlow / Admin / src / pages / Appointments / Components / AppointmentCard.jsx
import { Calendar } from "lucide-react";
import {
  formatDateISO,
  getAppointmentStatusFlags,
  getStatusBadgeClass,
} from "../../../utils/appointmentsUtils";
import { CURRENCY } from "../../../utils/helpers";
import "../Appointments.css";

const AppointmentCard = ({ appointment, index, isAdmin, onAdminCancel }) => {
  const { isCompleted, isDisabled } = getAppointmentStatusFlags(
    appointment.status,
  );

  return (
    <div
      style={{
        animation: `fadeUp 420ms cubic-bezier(.2,.9,.2,1) forwards`,
        animationDelay: `${index * 70}ms`,
        opacity: 0,
      }}
      className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm border border-indigo-100 flex flex-col gap-3 hover:shadow-md transform hover:-translate-y-1 transition"
    >
      <div className="flex items-start lg:line-clamp-2 justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-medium text-indigo-800 truncate">
              {appointment.patientName}
            </h3>

            <div className="text-xs sm:text-sm text-indigo-500 flex items-center gap-2">
              <span>{appointment.age ? `${appointment.age} years` : ""}</span>
              <span> {appointment.age ? ":" : ""} </span>
              <span>{appointment.gender}</span>
              <span className="hidden md:inline"> : </span>
              <span className=" max-w-30">{appointment.mobile}</span>
            </div>
          </div>

          <div className="mt-1 text-xs sm:text-sm text-indigo-600 truncate">
            {appointment.doctorName} :{" "}
            <span className="font-medium text-indigo-700">
              {appointment.speciality}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-nd lg:pt-3 lg:justify-start flex items-center font-bold text-indigo-700 text-xs sm:text-sm">
            Fees
          </div>

          <div className="text-lg sm:text-xl font-semibold lg:justify-start text-indigo-800 flex items-center justify-end gap-1">
            {CURRENCY} <span>{appointment.fee}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          <Calendar size={14} className="text-indigo-400" />
          <span>
            {formatDateISO(appointment.slot.date)} — {appointment.slot.time}
          </span>
        </div>

        <div
          className={`text-xs px-3 py-1 rounded-full border ${getStatusBadgeClass(appointment.status)}`}
        >
          {appointment.status?.toUpperCase() || "PENDING"}
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => onAdminCancel(appointment.id)}
              title={
                isDisabled
                  ? isCompleted
                    ? "Cannot cancel a completed appointment"
                    : "Already cancelled"
                  : "Admin Cancel (mark as cancelled)"
              }
              disabled={isDisabled}
              aria-disabled={isDisabled}
              className={`px-3 py-2 rounded-full text-sm flex items-center gap-2 transition ${
                isDisabled
                  ? "bg-red-50 text-red-400 opacity-60 cursor-not-allowed"
                  : "bg-red-50 text-red-700 hover:scale-105 cursor-pointer"
              }`}
            >
              {isDisabled
                ? isCompleted
                  ? "Completed"
                  : "Admin Cancelled"
                : "Admin Cancel"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
