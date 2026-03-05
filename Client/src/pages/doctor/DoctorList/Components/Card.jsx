// MediFlow / Client / src / pages / doctor / DoctorList / Components / Card.jsx
import { Banknote, Calendar, Phone, User } from "lucide-react";
import StatusBadge from "../../../../components/doctor/StatusBadge";
import StatusSelect from "../../../../components/doctor/StatusSelect";
import RescheduleButton from "../../../../components/doctor/RescheduleButton";
import { CURRENCY } from "../../../../utils/doctor/helpers";
import {
  formatDate,
  formatDoctorName,
  formatPatientName,
  formatTimeAMPM,
} from "../../../../utils/doctor/doctorListUtils";

const Card = ({ appointment, onStatusChange, onReschedule }) => {
  const a = appointment;

  return (
    <article className="rounded-2xl p-4 bg-white shadow-sm border border-indigo-100 hover:shadow-md transition flex flex-col justify-between self-start">
      <header className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          {a.doctorImage ? (
            <img
              src={a.doctorImage}
              alt={a.doctorName}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="text-indigo-700 font-bold">
              {(a.doctorName || "D").charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="mt-2 text-sm text-indigo-700 truncate">
            <span className="font-semibold text-indigo-900">
              {formatDoctorName(a.doctorName)}
            </span>
          </div>

          <div className="text-sm text-indigo-800 font-medium truncate">
            {a.speciality}
          </div>
        </div>
      </header>

      <div className="mt-4 flex flex-col items-start gap-3">
        <div className="text-indigo-800">
          <div className="text-sm flex items-center gap-2 w-full">
            <User className="w-4 h-4" />
            <span className="truncate">
              <span className="font-bold">
                {formatPatientName(a.patient) || "-"}{" "}
              </span>
            </span>
          </div>
          <span className="text-xs ml-6">
            ({a.age} yrs • {a.gender})
          </span>
        </div>

        <div className="text-sm text-indigo-800 font-bold flex items-center gap-2 w-full">
          <Calendar className="w-4 h-4" />
          <span className="truncate">
            <span className="whitespace-nowrap">{formatDate(a.date)}</span>
            <span className="sm:inline">:</span>
            <span>{formatTimeAMPM(a.time)}</span>
          </span>
        </div>
        <div className="flex text-sm text-indigo-800 font-semibold gap-2 items-center justify-center">
          <Banknote className="w-4 h-4" />{" "}
          <span className="truncate">
            {CURRENCY} {a.fee}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start gap-3">
        <div className="text-sm text-indigo-800 font-semibold flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span className="truncate">{a.mobile}</span>
        </div>

        <div className="flex flex-col items-end gap-2 w-full">
          <StatusBadge status={a.status} />
          <StatusSelect appointment={a} onChange={onStatusChange} />
        </div>
      </div>

      <div className="mt-4">
        <RescheduleButton appointment={a} onReschedule={onReschedule} />
      </div>
    </article>
  );
};

export default Card;
