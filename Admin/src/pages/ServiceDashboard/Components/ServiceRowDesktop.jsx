import { NoImage } from "../../../assets";
import { capitalizeWords, CURRENCY } from "../../../utils/helpers";

const ServiceRowDesktop = ({ s }) => {
  const earning = (s?.completed || 0) * (s?.price || 0);

  return (
    <div className="hidden lg:grid grid-cols-12 items-center gap-4 cursor-pointer">
      <div className="col-span-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden ring-1 ring-indigo-100 bg-gray-200">
          <img
            src={s.image || NoImage}
            alt={s.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="font-semibold md:text-xs lg:text-lg xl:text-lg text-indigo-800">
          {capitalizeWords(s.name)}
        </h3>
      </div>

      <div className="col-span-2">
        {CURRENCY} {s.price}
      </div>

      <div className="col-span-1 text-center">{s.totalAppointments}</div>

      <div className="col-span-1 text-center">{s.completed}</div>

      <div className="col-span-1 text-center">{s.canceled}</div>

      <div className="col-span-2 text-center">
        {CURRENCY} {earning}
      </div>
    </div>
  );
};

export default ServiceRowDesktop;
