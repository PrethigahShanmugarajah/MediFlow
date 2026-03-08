import {
  User,
  Phone,
  Banknote,
  Calendar,
  Clock,
  Stethoscope,
  Activity,
} from "lucide-react";
import StatusSelect from "../../../../components/doctor/StatusSelect";
import RescheduleButton from "../../../../components/doctor/RescheduleButton";
import StatusBadge from "../../../../components/doctor/StatusBadge";
import {
  capitalizeWords,
  CURRENCY,
  formatDoctorName,
} from "../../../../utils/helpers";
import {
  formatDate,
  formatTimeAMPM,
} from "../../../../utils/doctor/doctorHelpers";

const ViewCard = ({ appointment, onUpdateStatus, onReschedule }) => {
  const a = appointment;

  const isLocked = a.status === "complete" || a.status === "cancelled";

  return (
    <article className="group relative rounded-3xl p-1 h-full transform transition-all duration-300 hover:-translate-y-1">
      <div className="rounded-2xl overflow-hidden border border-indigo-200/70 p-5 bg-white/90 shadow-sm h-full flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={a.status} />
            <StatusSelect
              appointment={a}
              onChange={(s) => onUpdateStatus(a.id, s)}
              disabled={isLocked}
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 text-black text-sm sm:text-base">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-indigo-500" />
              <span className="font-medium">{capitalizeWords(a.patient)}</span>
            </div>

            <div className="flex items-center gap-3">
              <Stethoscope className="w-4 h-4 text-indigo-500" />
              <span className="font-medium">
                {formatDoctorName(a.doctorName)}
              </span>
            </div>

            {!!a.speciality && (
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-indigo-500" />
                <span>{capitalizeWords(a.speciality)}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-indigo-500" />
              <span>{a.mobile}</span>
            </div>

            <div className="flex items-center gap-3">
              <Banknote className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold">
                {CURRENCY} {a.fee}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>{formatDate(a.date)}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{formatTimeAMPM(a.time)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              <RescheduleButton
                appointment={a}
                onReschedule={(d, t) => onReschedule(a.id, d, t)}
                disabled={false}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ViewCard;
