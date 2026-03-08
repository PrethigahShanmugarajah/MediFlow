import { ScaleLoader } from "react-spinners";
import ServiceRowTablet from "./ServiceRowTablet";
import ServiceRowDesktop from "./ServiceRowDesktop";
import ServiceRowMobile from "./ServiceRowMobile";

const ServiceTable = ({ loading, error, services }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-b border-transparent">
      {/* -------- Tablet Screen -------- */}
      <div className="hidden md:grid lg:hidden grid-cols-5 items-center gap-6 px-4 py-3 text-sm text-gray-600 bg-indigo-50">
        <div className="text-center text-xs font-medium">Service</div>
        <div className="text-center text-xs font-medium">Appointments</div>
        <div className="text-center text-xs font-medium">Completed</div>
        <div className="text-center text-xs font-medium">Canceled</div>
        <div className="text-center text-xs font-medium">Earning</div>
      </div>

      {/* -------- Desktop Screen -------- */}
      <div className="hidden lg:grid md:text-xs lg:text-xs xl:text-md grid-cols-12 items-center gap-4 px-4 py-3 text-sm text-gray-600 bg-indigo-50">
        <div className="col-span-5">Service</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-1 text-center text-xs font-medium">
          Appointments
        </div>
        <div className="col-span-1 text-center text-xs font-medium">
          Completed
        </div>
        <div className="col-span-1 text-center text-xs font-medium">
          Canceled
        </div>
        <div className="col-span-2 text-center">Earning</div>
      </div>

      <div className="divide-y divide-transparent min-w-full">
        {loading ? (
          <div className="px-4 py-6 text-center text-gray-500">
            <ScaleLoader height={28} width={4} color="#6366F1" />
          </div>
        ) : error ? (
          <div className="px-4 py-6 text-center text-red-600">{error}</div>
        ) : services.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            No services found.
          </div>
        ) : (
          services.map((s) => {
            return (
              <div
                key={s.id}
                className="px-4 py-4 font-serif hover:shadow-md transition bg-white md:bg-transparent"
              >
                <ServiceRowTablet s={s} />
                <ServiceRowDesktop s={s} />
                <ServiceRowMobile s={s} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ServiceTable;
