// MediFlow / Client / src / components / DoctorsPage / Components / DoctorsSearchBar.jsx
import { Search, X } from "lucide-react";
import { InputField } from "../../FormField/InputField";

const DoctorsSearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex justify-center mb-8 sm:mb-12 animate-slide-up">
      <div className="relative w-full max-w-xl transition-all duration-500 px-2 sm:px-0">
        <InputField
          name="doctorSearch"
          type="text"
          placeholder="Search doctors by name or specialization..."
          value={searchTerm}
          onChange={(val) => setSearchTerm(val)}
          unstyled={false}
          inputClassName="py-3 sm:py-4 pl-12 pr-10"
        />

        <Search className="absolute left-4 top-3 sm:top-4 text-indigo-600 w-5 h-5 sm:w-6 sm:h-6" />

        {searchTerm.length > 0 && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-3 sm:top-4 text-indigo-600 hover:text-indigo-800 transition"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorsSearchBar;
