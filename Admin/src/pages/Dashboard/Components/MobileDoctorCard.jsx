import { NoPersonImage } from "../../../assets";
import {
  capitalizeWords,
  CURRENCY,
  formatDoctorName,
} from "../../../utils/helpers";

const MobileDoctorCard = ({ d }) => {
  return (
    <div className="bg-white rounded-xl shadow p-3 border border-blue-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={d.image || NoPersonImage}
            alt={formatDoctorName(d.name)}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <div className="text-sm font-medium text-slate-800">
              {formatDoctorName(d.name)}
            </div>
            <div className="text-xs text-slate-500">
              {capitalizeWords(d.specialization)}
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-700 font-semibold">
          {CURRENCY} {d.fee}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-xs text-slate-500">Appointments</div>
          <div className="text-sm font-semibold text-slate-800">
            {d.appointments.total}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500">Done</div>
          <div className="text-sm font-semibold  text-indigo-600">
            {d.appointments.completed}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500">Cancel</div>
          <div className="text-sm font-semibold  text-red-500">
            {d.appointments.canceled}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
        <div>Earned</div>
        <div className="font-semibold">
          {CURRENCY} {d.earnings.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default MobileDoctorCard;
