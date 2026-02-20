// MediFlow / Client / src / components / DoctorsPage / Components / DoctorsSkeleton.jsx

const DoctorsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 md:p-6 text-center transition-all duration-300"
      >
        <div className="relative mx-auto mb-4 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-emerald-100 rounded-full"></div>
        <div className="h-5 bg-emerald-100 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-emerald-100 rounded w-1/2 mx-auto mb-3"></div>
        <div className="h-8 bg-emerald-100 rounded w-full mx-auto mt-4"></div>
      </div>
    ))}
  </div>
);

export default DoctorsSkeleton;
