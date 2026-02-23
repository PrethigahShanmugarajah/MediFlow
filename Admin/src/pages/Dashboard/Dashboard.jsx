// MediFlow / Admin / src / pages / Dashboard / Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  computeDashboardTotals,
  filterDoctors,
  INITIAL_COUNT,
} from "../../utils/dashboardUtils";
import {
  getDoctorsForDashboard,
  getRegisteredUserCount,
} from "./Service/DashboardService";
import { InputField } from "../../components/FormField/InputField";
import { BeatLoader, ScaleLoader } from "react-spinners";
import MobileDoctorCard from "./Components/MobileDoctorCard";
import StatsSection from "./Components/StatsSection";
import DoctorsTable from "./Components/DoctorsTable";
import ShowMoreButton from "../../components/ShowMoreButton ";

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientCount, setPatientCount] = useState(null);
  const [patientCountLoading, setPatientCountLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadCount() {
      setPatientCountLoading(true);
      try {
        const count = await getRegisteredUserCount();
        if (mounted) setPatientCount(count);
      } catch (err) {
        console.error("Failed to fetch patient count:", err);
        if (mounted) setPatientCount(0);
      } finally {
        if (mounted) setPatientCountLoading(false);
      }
    }

    loadCount();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadDoctors() {
      setLoading(true);
      setError(null);

      try {
        const normalized = await getDoctorsForDashboard({ limit: 200 });
        if (mounted) setDoctors(normalized);
      } catch (err) {
        console.error("Failed to load doctors:", err);
        if (mounted) {
          setError(err?.message || "Failed to load doctors");
          setDoctors([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDoctors();
    return () => {
      mounted = false;
    };
  }, []);

  const totals = useMemo(() => computeDashboardTotals(doctors), [doctors]);

  const filteredDoctors = useMemo(
    () => filterDoctors(doctors, query),
    [doctors, query],
  );

  const visibleDoctors = showAll
    ? filteredDoctors
    : filteredDoctors.slice(0, INITIAL_COUNT);

  return (
    <div className="min-h-screen font-serif p-4 sm:p-6 from-indigo-100 via-white to-blue-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 uppercase">
              Dashboard
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Overview of doctors & appointments
            </p>
          </div>
        </div>

        <StatsSection
          totals={totals}
          patientCount={patientCount}
          patientCountLoading={patientCountLoading}
          loading={loading}
        />

        <div className="mb-6">
          <label className="block text-lg text-slate-600 mb-2">
            Search Doctors
          </label>
          <div className="flex items-center gap-3 max-w-md">
            <div className="relative flex-1">
              <InputField
                name="search"
                type="text"
                placeholder="Search name / Specialization / fee"
                size="s"
                value={query}
                onChange={(value) => setQuery(value)}
                unstyled={false}
                inputClassName="pl-10"
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-blue-500" />
            </div>

            <button
              onClick={() => {
                setQuery("");
                setShowAll(false);
              }}
              className="px-3 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Doctors</h2>

            <p className="text-sm text-slate-500">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <BeatLoader size={6} color="#6366F1" />
                </span>
              ) : (
                `Showing ${visibleDoctors.length} of ${filteredDoctors.length}`
              )}
            </p>
          </div>

          {error && (
            <div className="px-6 py-4 border-b border-blue-50 text-sm text-rose-600">
              Error loading doctors: {error}
            </div>
          )}

          <DoctorsTable
            doctors={visibleDoctors}
            loading={loading}
            query={query}
          />

          <div className="md:hidden px-4 py-4">
            <div className="space-y-3">
              {visibleDoctors.length === 0 ? (
                <div className="col-span-full text-center justify-center py-10 text-gray-500 font-medium">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <ScaleLoader height={28} width={4} color="#6366F1" />
                    </div>
                  ) : query ? (
                    "No doctors match your search"
                  ) : (
                    "No doctors found"
                  )}
                </div>
              ) : (
                visibleDoctors.map((d) => <MobileDoctorCard key={d.id} d={d} />)
              )}
            </div>
          </div>

          <ShowMoreButton
            id="doctors-show-more"
            total={filteredDoctors.length}
            limit={INITIAL_COUNT}
            showAll={showAll}
            onToggle={() => setShowAll((s) => !s)}
            showIcon
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
