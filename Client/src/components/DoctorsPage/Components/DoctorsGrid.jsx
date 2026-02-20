// MediFlow / Client / src / components / DoctorsPage / Components / DoctorsGrid.jsx
import DoctorCard from "./DoctorCard";

const DoctorsGrid = ({ doctors, emptyCount }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 sm:gap-8 transition-all duration-300 ${
        emptyCount === 0 ? "opacity-70" : "opacity-100"
      }`}
    >
      {doctors.length > 0 ? (
        doctors.map((doctor, index) => (
          <DoctorCard
            key={doctor.id || `${doctor.name}-${index}`}
            doctor={doctor}
            index={index}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-indigo-800 font-medium text-base animate-fade-in">
          No doctors found matching your search criteria.
        </div>
      )}
    </div>
  );
};

export default DoctorsGrid;
