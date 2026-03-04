// MediFlow / Client / src / pages / client / Doctors / View / Doctors.jsx
import { useEffect, useMemo, useState } from "react";
import { Medal } from "lucide-react";
import "../Doctors.css";
import { fetchDoctorsApi } from "../Service/DoctorsService";
import ClientTitle from "../../../../components/client/ClientTitle";
import SearchField from "../../../../components/common/SearchField";
import ApiError from "../../../../components/common/ApiError";
import AvatarSkeletonCard from "../../../../components/common/AvatarSkeletonCard";
import AvatarCard from "../../../../components/common/AvatarCard";
import { formatDoctorName } from "../../../../utils/client/doctorsUtils";
import { NoPersonImage } from "../../../../assets";
import ShowMoreButton from "../../../../components/common/ShowMoreButton";

const Doctors = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchDoctorsApi(setAllDoctors, setError, setLoading);
  }, []);

  const filteredDoctors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allDoctors;
    return allDoctors.filter(
      (doctor) =>
        (doctor.name || "").toLowerCase().includes(q) ||
        (doctor.specialization || "").toLowerCase().includes(q),
    );
  }, [allDoctors, searchTerm]);

  const displayedDoctors = showAll
    ? filteredDoctors
    : filteredDoctors.slice(0, 8);

  const retry = () => fetchDoctorsApi(setAllDoctors, setError, setLoading);

  useEffect(() => {
    setShowAll(false);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-white to-indigo-100 py-8 sm:py-10 px-3 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 font-serif">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in">
          <ClientTitle
            title="Our Medical Experts"
            description="Find your ideal doctor by name or specialization"
          />
        </div>

        <div className="flex justify-center mb-8 sm:mb-12 animate-slide-up">
          <div className="w-full max-w-xl px-2 sm:px-0">
            <SearchField
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search doctors by name or specialization..."
              size="l"
              widthClass=""
              showClear
              inputClassName=""
              className="rounded-full border border-indigo-300"
            />
          </div>
        </div>

        <ApiError message={error} onRetry={retry} />

        {loading ? (
          <AvatarSkeletonCard
            count={8}
            columns="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
          />
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 sm:gap-8 transition-all duration-300 ${
              filteredDoctors.length === 0 ? "opacity-70" : "opacity-100"
            }`}
          >
            {displayedDoctors.length > 0
              ? displayedDoctors.map((doctor, index) => (
                  <div
                    key={doctor.id || `${doctor.name}-${index}`}
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <AvatarCard
                      id={doctor.id}
                      name={formatDoctorName(doctor.name)}
                      subtitle={doctor.specialization}
                      image={doctor.image}
                      available={doctor.available}
                      linkTo={`/doctors/${doctor.id}`}
                      stateObj={{ doctor: doctor.raw || doctor }}
                      badgeIcon={Medal}
                      badgeText={`${doctor.experience || "-"} years Experience`}
                      placeholderImage={NoPersonImage}
                      buttonText="Book Now"
                    />
                  </div>
                ))
              : !error && (
                  <div className="col-span-full text-center py-10 text-indigo-800 font-medium text-base animate-fade-in">
                    {searchTerm.trim()
                      ? "No doctors found matching your search criteria."
                      : "No doctors available right now."}
                  </div>
                )}
          </div>
        )}

        <ShowMoreButton
          id="doctors-show-more"
          total={filteredDoctors.length}
          limit={8}
          showAll={showAll}
          onToggle={() => setShowAll((v) => !v)}
          wrapperClassName="mt-8 sm:mt-15"
          moreText="Show More"
          lessText="Hide"
          showRemainingCount
          showIcon
        />
      </div>
    </div>
  );
};

export default Doctors;
