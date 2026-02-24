// MediFlow / Admin / src / pages / Appointments / Components / AppointmentsHeader.jsx
import { useMemo } from "react";
import Title from "../../../components/Title";
import SearchField from "../../../components/SearchField";
import { Calendar } from "lucide-react";
import { InputField } from "../../../components/FormField/InputField";
import { SelectInput } from "../../../components/FormField/SelectInput";

const AppointmentsHeader = ({
  query,
  setQuery,
  filterDate,
  setFilterDate,
  filterSpeciality,
  setFilterSpeciality,
  specialities,
  onClear,
}) => {
  const specialityOptions = useMemo(
    () =>
      (specialities || []).map((s) => ({
        value: s,
        label: s === "all" ? "All Specialities" : s,
      })),
    [specialities],
  );

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <Title
        title="Appointments"
        subtitle="Manage and search upcoming patient appointments"
        wrapperClassName="w-full sm:w-auto mb-0"
      />

      <div className="w-full sm:w-auto">
        <div className="flex flex-col md:flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <SearchField
            value={query}
            onChange={(val) => setQuery(val)}
            placeholder="Search doctor, patient, speciality or mobile"
            size="s"
            widthClass="sm:w-72"
            className=""
            inputClassName="bg-transparent"
            unstyled={false}
          />

          <div className="flex items-center flex-col md:flex-row lg:flex-row gap-2 w-full sm:w-auto">
            <div className="bg-white rounded-full px-3 py-2 shadow-sm flex items-center gap-2 w-full sm:w-auto">
              <Calendar size={14} className="text-indigo-400" />
              <InputField
                name="appointments_date"
                type="date"
                size="xs"
                unstyled
                value={filterDate}
                onChange={(val) => setFilterDate(val)}
              />
            </div>

            <SelectInput
              size="m"
              value={filterSpeciality}
              onChange={(val) => setFilterSpeciality(val)}
              options={specialityOptions}
              placeholder="All Specialities"
              className="w-full sm:w-52"
            />

            <button
              onClick={onClear}
              className="ml-0 sm:ml-2 px-3 cursor-pointer py-2 rounded-full bg-indigo-600 text-white text-sm shadow-sm hover:opacity-95 transition w-full sm:w-auto"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppointmentsHeader;
