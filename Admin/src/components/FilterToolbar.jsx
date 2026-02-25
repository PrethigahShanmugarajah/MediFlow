// MediFlow / Admin / src / components / FilterToolbar.jsx
import SearchField from "./SearchField";

const COLOR_MAP = {
  indigo: {
    active: "bg-indigo-600 text-white border-indigo-600",
    inactive: "bg-white text-indigo-600 border-indigo-100",
    hover: "hover:bg-indigo-50",
  },
  sky: {
    active: "bg-sky-600 text-white border-sky-600",
    inactive: "bg-white text-sky-600 border-sky-100",
    hover: "hover:bg-sky-50",
  },
  red: {
    active: "bg-red-600 text-white border-red-600",
    inactive: "bg-white text-red-600 border-red-100",
    hover: "hover:bg-red-50",
  },
};

const FilterToolbar = ({
  filters = [],
  value,
  onChange,
  searchValue,
  onSearchChange,
  placeholder = "Search...",
  containerClassName = "",
  searchRight = null,
  searchWidthClass = "md:w-96",
}) => {
  return (
    <div className={`flex flex-col gap-3 w-full ${containerClassName}`}>
      <div className="inline-flex items-center gap-2 rounded-full p-1 w-fit">
        {filters.map((f) => {
          const colors = COLOR_MAP[f.color] || COLOR_MAP.indigo;
          const isActive = value === f.value;

          return (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange?.(f.value)}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                isActive ? colors.active : `${colors.inactive} ${colors.hover}`
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex w-full md:w-fit items-center gap-3">
        <SearchField
          value={searchValue}
          onChange={onSearchChange}
          placeholder={placeholder}
          className=""
          widthClass={`w-full ${searchWidthClass}`}
        />

        {searchRight ? <div className="shrink-0">{searchRight}</div> : null}
      </div>
    </div>
  );
};

export default FilterToolbar;
