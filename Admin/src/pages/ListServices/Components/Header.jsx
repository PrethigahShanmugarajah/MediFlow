// MediFlow / Admin / src / pages / ListServices / Components / Header.jsx
import FilterToolbar from "../../../components/FilterToolbar";
import Title from "../../../components/Title";

const Header = ({ search, setSearch, filterMode, setFilterMode }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <Title
        title="Services"
        subtitle="Manage your services — edit, schedule slots or remove"
      />

      <div className="w-full md:w-auto md:ml-auto">
        <FilterToolbar
          filters={[
            { label: "All", value: "all", color: "indigo" },
            { label: "Available", value: "available", color: "sky" },
            { label: "Unavailable", value: "unavailable", color: "red" },
          ]}
          value={filterMode}
          onChange={setFilterMode}
          searchValue={search}
          onSearchChange={setSearch}
          placeholder="Search services..."
          containerClassName="md:items-end"
        />
      </div>
    </div>
  );
};

export default Header;
