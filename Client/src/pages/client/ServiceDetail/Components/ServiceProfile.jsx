import { NoImage } from "../../../../assets";

const ServiceProfile = ({ service }) => {
  return (
    <div className="lg:col-span-1 flex flex-col items-center space-y-6">
      <div className="relative w-full">
        <div className="absolute -inset-2 sm:-inset-3 md:-inset-6 bg-linear-to-br from-indigo-400 to-blue-400 rounded-3xl blur-lg opacity-50" />

        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 rounded-3xl overflow-hidden border-4 border-white shadow-2xl z-10">
          <img
            src={service?.imageUrl || service?.image || NoImage}
            alt={service?.name || "Service"}
            className="w-full h-full object-cover object-center transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceProfile;
