// MediFlow / Admin / src / pages / ListDoctors / Components / Header.jsx
import FilterToolbar from "../../../components/FilterToolbar";
import Title from "../../../components/Title";

const Header = ({
  query,
  setQuery,
  filterStatus,
  applyStatusFilter,
  onClear,
}) => {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <Title
        title="Find a Doctor"
        subtitle="Search by name or specialization"
      />

      <div className="w-full md:w-auto md:ml-auto">
        <FilterToolbar
          filters={[
            { label: "All", value: "all", color: "indigo" },
            { label: "Available", value: "available", color: "sky" },
            { label: "Unavailable", value: "unavailable", color: "red" },
          ]}
          value={filterStatus}
          onChange={applyStatusFilter}
          searchValue={query}
          onSearchChange={setQuery}
          placeholder="Search doctors or specialization"
          containerClassName="md:items-end"
          searchWidthClass="md:w-96"
          showClearButton
          onClear={onClear}
        />
      </div>
    </header>
  );
};

export default Header;
