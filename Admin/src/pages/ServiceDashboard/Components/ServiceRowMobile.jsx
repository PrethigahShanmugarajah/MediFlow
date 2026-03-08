import { Banknote, Calendar, CheckCircle, XCircle } from "lucide-react";
import { capitalizeWords, CURRENCY } from "../../../utils/helpers";
import { NoImage } from "../../../assets";

const ServiceRowMobile = ({ s }) => {
  const earning = (s?.completed || 0) * (s?.price || 0);

  return (
    <div className="md:hidden flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 ring-1 ring-indigo-100">
          <img
            src={s.image || NoImage}
            alt={s.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-xs text-indigo-800">
              {capitalizeWords(s.name)}
            </h3>
            <div className="text-sm font-medium">
              {CURRENCY} {s.price}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-2 bg-indigo-50 px-2 py-1 rounded-full ring-1 ring-indigo-100 text-black">
              <Calendar size={14} />
              <span className="leading-none">
                {s.totalAppointments} Appointments
              </span>
            </div>

            <div className="flex items-center gap-2 bg-indigo-50 px-2 py-1 rounded-full ring-1 ring-indigo-100 text-indigo-700">
              <CheckCircle size={14} />
              <span className="leading-none">{s.completed} Completed</span>
            </div>

            <div className="flex items-center gap-2 bg-rose-50 px-2 py-1 rounded-full ring-1 ring-rose-100 text-rose-500">
              <XCircle size={14} />
              <span className="leading-none">{s.canceled} Canceled</span>
            </div>

            <div className="flex items-center gap-2 bg-indigo-50 px-2 py-1 rounded-full ring-1 ring-indigo-100 text-black">
              <Banknote size={14} />
              <span className="leading-none">
                Total Earning : {CURRENCY} {earning}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRowMobile;
