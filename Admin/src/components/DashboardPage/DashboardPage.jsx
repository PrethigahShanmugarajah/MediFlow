// MediFlow / Admin / src / components / DashboardPage / DashboardPage.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  CalendarRange,
  CheckCircle,
  Search,
  Stethoscope,
  Users,
  XCircle,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { InputField } from "../FormField/FormField";
import { calculateTotals, filterDoctors, normalizeDoctor } from "./Services";
import MobileDoctorCard from "./components/MobileDoctorCard";
import StatCard from "./components/StatCard";
import { fetchDoctors, fetchPatientCount } from "../../services/fetch";

const DashboardPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patientCount, setPatientCount] = useState(null);
  const [patientCountLoading, setPatientCountLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  const { control, watch, setValue } = useForm({
    defaultValues: { search: "" },
  });

  const query = watch("search");

  useEffect(() => {
    let mounted = true;

    async function loadDoctors() {
      setLoading(true);
      setStatsLoading(true);
      setError(null);

      try {
        const data1 = await fetchDoctors({ limit: 200 });

        let list = [];

        if (Array.isArray(data1)) list = data1;
        else if (Array.isArray(data1.doctors)) list = data1.doctors;
        else if (Array.isArray(data1.data)) list = data1.data;
        else if (Array.isArray(data1.items)) list = data1.items;
        else {
          const firstArray = Object.values(data1 || {}).find((v) =>
            Array.isArray(v),
          );
          if (firstArray) list = firstArray;
        }

        const normalized = list.map((d) => normalizeDoctor(d));

        if (mounted) setDoctors(normalized);
      } catch (error1) {
        if (mounted) {
          setError(error1.message || "Failed to load doctors");
          setDoctors([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setStatsLoading(false);
        }
      }
    }

    loadDoctors();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadPatientCount() {
      setPatientCountLoading(true);

      try {
        const count = await fetchPatientCount();

        if (mounted) setPatientCount(count);
      } catch (error2) {
        if (mounted) setPatientCount(0);
      } finally {
        if (mounted) setPatientCountLoading(false);
      }
    }

    loadPatientCount();

    return () => {
      mounted = false;
    };
  }, []);

  const totals = useMemo(() => calculateTotals(doctors), [doctors]);

  const filteredDoctors = useMemo(
    () => filterDoctors(doctors, query),
    [doctors, query],
  );

  const INITIAL_COUNT = 8;

  const visibleDoctors = showAll
    ? filteredDoctors
    : filteredDoctors.slice(0, INITIAL_COUNT);

  return (
    <div className="min-h-screen font-serif p-4 sm:p-6 bg-linear-to-br from-blue-50 via-blue-100 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Dashboard
            </h1>
            <p className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
              Doctors and appointments at a glance
            </p>
          </div>
        </div>

        {/* -------- Stats Section -------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Total Doctors"
            value={
              statsLoading ? (
                <div className="text-center col-span-full rounded-lg flex items-center justify-start gap-3 mt-1.5">
                  <ClipLoader size={18} color="#3B82F6" />
                </div>
              ) : (
                totals.totalDoctors
              )
            }
          />

          <StatCard
            icon={<Stethoscope className="w-6 h-6" />}
            label="Total Doctors"
            value={
              patientCountLoading ? (
                <div className="text-center col-span-full rounded-lg flex items-center justify-start gap-3 mt-1.5">
                  <ClipLoader size={18} color="#3B82F6" />
                </div>
              ) : (
                (patientCount ?? totals.totalLoginPatients)
              )
            }
          />

          <StatCard
            icon={<CalendarRange className="w-6 h-6" />}
            label="Total Appointments"
            value={
              statsLoading ? (
                <div className="text-center col-span-full rounded-lg flex items-center justify-start gap-3 mt-1.5">
                  <ClipLoader size={18} color="#3B82F6" />
                </div>
              ) : (
                totals.totalAppointments
              )
            }
          />

          <StatCard
            icon={<Banknote className="w-6 h-6" />}
            label="Total Earnings"
            value={
              statsLoading ? (
                <div className="text-center col-span-full rounded-lg flex items-center justify-start gap-3 mt-1.5">
                  <ClipLoader size={18} color="#3B82F6" />
                </div>
              ) : (
                `LKR ${totals.totalEarnings.toLocaleString()}`
              )
            }
          />

          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label="Completed"
            value={
              statsLoading ? (
                <div className="text-center col-span-full rounded-lg flex items-center justify-start gap-3 mt-1.5">
                  <ClipLoader size={18} color="#3B82F6" />
                </div>
              ) : (
                totals.completed
              )
            }
          />

          <StatCard
            icon={<XCircle className="w-6 h-6" />}
            label="Canceled"
            value={
              statsLoading ? (
                <div className="text-center col-span-full rounded-lg flex items-center justify-start gap-3 mt-1.5">
                  <ClipLoader size={18} color="#3B82F6" />
                </div>
              ) : (
                totals.canceled
              )
            }
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg text-slate-600 mb-2">
            Search Doctors
          </label>

          <div className="flex items-center gap-3 max-w-md">
            <div className="relative flex-1">
              <InputField
                control={control}
                name="search"
                type="text"
                placeholder="Search name / Specialization / fee"
                className="w-full"
                inputClassName="pl-10 pr-4 py-2 rounded-full shadow-sm border border-blue-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
              />

              <Search className="absolute left-3 top-2.5 w-5 h-5 text-blue-500" />
            </div>

            <button
              onClick={() => {
                setValue("search", "");
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
            <div className="text-sm text-slate-500">
              {loading ? (
                <div className="text-center col-span-full rounded-lg flex items-center justify-start gap-3 mt-0.5">
                  <ClipLoader size={18} color="#3B82F6" />
                </div>
              ) : (
                `Showing ${visibleDoctors.length} of ${filteredDoctors.length}`
              )}
            </div>
          </div>

          {error && (
            <div className="px-6 py-4 border-b border-blue-50 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-50">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Doctor
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Specialization
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Fee
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Appointments
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Completed
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Canceled
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Total Earnings
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-blue-50 cursor-pointer">
                {visibleDoctors.map((d, idx) => (
                  <tr
                    key={d.id}
                    className={`group transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                      idx % 2 === 0 ? "bg-white" : "bg-blue-50/40"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                      <div className="w-1 h-12 rounded-md mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-b from-indigo-400 to-blue-200" />
                      <img
                        src={d.image}
                        alt={d.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-800">
                          {d.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          ID: {d.id}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {d.specialization}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-700">
                      LKR {d.fee}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-700">
                      {d.appointments.total}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-indigo-600">
                      {d.appointments.completed}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-500">
                      {d.appointments.canceled}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-slate-800">
                      LKR {d.earnings.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden px-4 py-4">
            <div className="space-y-3">
              {visibleDoctors.map((d) => (
                <MobileDoctorCard key={d.id} d={d} />
              ))}
            </div>
          </div>

          {filteredDoctors.length > INITIAL_COUNT && (
            <div className="px-6 py-4 border-t border-blue-50 flex justify-center">
              <button
                onClick={() => setShowAll((s) => !s)}
                className="px-4 py-2 rounded-full bg-white border border-blue-200 shadow-sm hover:bg-blue-50 transition"
              >
                {showAll
                  ? "Show Less"
                  : `Show more (${filteredDoctors.length - INITIAL_COUNT})`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
