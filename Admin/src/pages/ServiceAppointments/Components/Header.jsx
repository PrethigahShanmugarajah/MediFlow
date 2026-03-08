import SearchField from "../../../components/SearchField";
import { SelectInput } from "../../../components/FormField/SelectInput";
import Title from "../../../components/Title";
import { BeatLoader } from "react-spinners";

const Header = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onRefresh,
  count,
  loading,
}) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="min-w-0">
        <Title
          title="Appointments"
          subtitle="Manage patient bookings - quick search & status controls"
        />
      </div>

      <div className="w-full md:w-96 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search by patient or service..."
            size="s"
            widthClass=""
            className="w-full"
            showClear
            inputClassName=""
          />

          <SelectInput
            options={[
              { value: "", label: "All" },
              { value: "Pending", label: "Pending" },
              { value: "Confirmed", label: "Confirmed" },
              { value: "Rescheduled", label: "Rescheduled" },
              { value: "Completed", label: "Completed" },
              { value: "Canceled", label: "Canceled" },
            ]}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            isClearable={false}
            placeholder="All"
            size="sm:m md:m lg:m"
            className="sm:w-64 md:w-85 lg:w-85"
          />
        </div>

        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {loading ? (
              <BeatLoader size={6} color="#6366F1" />
            ) : (
              <>
                {count} result{count !== 1 ? "s" : ""}
              </>
            )}
          </div>

          <div>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="text-xs p-1.5 border border-indigo-600 bg-indigo-100 rounded-full text-indigo-600"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
