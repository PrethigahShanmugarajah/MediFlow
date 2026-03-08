import { NoImage } from "../../../assets";
import { capitalizeWords, CURRENCY } from "../../../utils/helpers";

const ServiceRowTablet = ({ s }) => {
  const earning = (s?.completed || 0) * (s?.price || 0);

  return (
    <div className="hidden md:grid lg:hidden grid-cols-5 items-center gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 ring-1 ring-indigo-100">
          <img
            src={s.image || NoImage}
            alt={s.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-indigo-800 whitespace-nowrap">
            {capitalizeWords(s.name)}
          </div>
          <div className="text-xs text-gray-500">
            {CURRENCY} {s.price}
          </div>
        </div>
      </div>

      <div className="text-center text-sm">{s.totalAppointments}</div>

      <div className="text-center text-sm text-indigo-700">{s.completed}</div>

      <div className="text-center text-sm text-rose-500">{s.canceled}</div>

      <div className="text-sm text-center">
        {CURRENCY} {earning}
      </div>
    </div>
  );
};

export default ServiceRowTablet;
