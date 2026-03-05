// MediFlow / Client / src / pages / doctor / DoctorList / Components / Header.jsx
import DocTitle from "../../../../components/doctor/DocTitle";
import SearchField from "../../../../components/common/SearchField";
import { SelectInput } from "../../../../components/common/FormField/SelectInput";
import { statusOptions } from "../../../../utils/doctor/doctorListUtils";

const Header = ({
  search = "",
  onSearchChange,
  statusFilter = "",
  onStatusFilterChange,
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <DocTitle
        title="Appointments Overview"
        description="Most recent first — filter by patient"
      />

      <div className="flex flex-col pt-10 md:pt-0 sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <SearchField
          value={search}
          onChange={onSearchChange}
          placeholder="Search Patient Name"
          size="s"
          widthClass="sm:w-64 md:w-80 lg:w-96"
          showClear
        />

        <div className="w-full sm:w-auto">
          <SelectInput
            options={statusOptions}
            value={statusFilter}
            onChange={(val) => onStatusFilterChange?.(val)}
            placeholder="All"
            size="m"
            className="w-full sm:w-44"
            isClearable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
