// MediFlow / Client / src / components / DoctorsPage / DoctorsPage.jsx
import { useMemo, useState } from "react";
import "./DoctorsPage.css";
import { useDoctors } from "./Hooks/useDoctors";
import { filterDoctors } from "./Utils/filterDoctors";
import DoctorsHeader from "./Components/DoctorsHeader";
import DoctorsSearchBar from "./Components/DoctorsSearchBar.JSX";
import DoctorsError from "./Components/DoctorsError";
import DoctorsSkeleton from "./Components/DoctorsSkeleton";
import DoctorsGrid from "./Components/DoctorsGrid";
import ShowAllButton from "./Components/ShowAllButton";

const DoctorsPage = () => {
  const { allDoctors, loading, error, retry } = useDoctors();

  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredDoctors = useMemo(
    () => filterDoctors(allDoctors, searchTerm),
    [allDoctors, searchTerm],
  );

  const displayedDoctors = showAll
    ? filteredDoctors
    : filteredDoctors.slice(0, 8);

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 to-teal-100 py-8 sm:py-10 px-3 sm:px-6 relative overflow-hidden">
      <div className="absolute -top-40 -right-32 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-32 w-72 h-72 sm:w-96 sm:h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative z-10 font-serif">
        <DoctorsHeader />

        <DoctorsSearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {error && <DoctorsError error={error} onRetry={retry} />}

        {loading ? (
          <DoctorsSkeleton />
        ) : (
          <DoctorsGrid
            doctors={displayedDoctors}
            emptyCount={filterDoctors.length}
          />
        )}

        {filteredDoctors.length > 8 && (
          <ShowAllButton
            showAll={showAll}
            toggle={() => setShowAll((s) => !s)}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
