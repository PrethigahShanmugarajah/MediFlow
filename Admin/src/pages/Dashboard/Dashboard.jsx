// MediFlow / Admin / src / pages / Dashboard / Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import Title from "../../components/Title";
import SearchField from "../../components/SearchField";
import {
  computeDashboardTotals,
  filterDoctors,
  INITIAL_COUNT,
} from "../../utils/dashboardUtils";
import {
  getDoctorsForDashboard,
  getRegisteredUserCount,
} from "./Service/DashboardService";
import { BeatLoader, ScaleLoader } from "react-spinners";
import MobileDoctorCard from "./Components/MobileDoctorCard";
import StatsSection from "./Components/StatsSection";
import DoctorsTable from "./Components/DoctorsTable";
import ShowMoreButton from "../../components/ShowMoreButton";

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
        <Title
          title="Dashboard"
          subtitle="Overview of doctors & appointments"
        />

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
            <SearchField
              value={query}
              onChange={(val) => setQuery(val)}
              placeholder="Search name / Specialization / fee"
              size="s"
              widthClass=""
              className="flex-1"
              showClear
              unstyled={false}
            />
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
              {error}
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
