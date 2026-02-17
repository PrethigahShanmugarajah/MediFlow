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
import api from "../../api/axios";
import API_ROUTES from "../../api/api_route";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { InputField } from "../FormField/FormField";
import { normalizeDoctor, safeNumber } from "./Services";
import MobileDoctorCard from "./components/MobileDoctorCard";
import StatCard from "./components/StatCard";

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
        const response1 = await api.get(API_ROUTES.DOCTORS.DOCTORS_GET);

        console.log("Fetch Doctors API Response:", response1);

        const data1 = response1.data;

        if (data1?.success) {
          let list = [];
          if (Array.isArray(data1)) list = data1;
          else if (Array.isArray(data1.doctors)) list = data1.doctors;
          else if (Array.isArray(data1.data)) list = data1.data;
          else if (Array.isArray(data1.items)) list = data1.items;
          else {
            const firstArray = Object.values(data1).find((v) =>
              Array.isArray(v),
            );
            if (firstArray) list = firstArray;
          }

          const normalized = list.map((d) => normalizeDoctor(d));
          if (mounted) setDoctors(normalized);

          // toast.success(data1?.message || "Doctors loaded successfully");
          console.log("Fetch Doctors Success:", data1?.message);
        } else {
          let list = [];
          if (Array.isArray(data1)) list = data1;
          else if (Array.isArray(data1.doctors)) list = data1.doctors;
          else if (Array.isArray(data1.data)) list = data1.data;
          else if (Array.isArray(data1.items)) list = data1.items;
          else {
            const firstArray = Object.values(data1).find((v) =>
              Array.isArray(v),
            );
            if (firstArray) list = firstArray;
          }

          const normalized = list.map((d) => normalizeDoctor(d));
          if (mounted) setDoctors(normalized);

          toast.warn(data1?.message || "Doctors fetched with warnings");
          console.warn("Fetch Doctors Warning:", data1?.message);
        }
      } catch (error1) {
        toast.error(
          error1?.response?.data?.message ||
            error1?.message ||
            "Failed to load doctors",
        );
        console.error("Fetch Doctors Error:", error1);

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
        const response2 = await api.get(
          API_ROUTES.APPOINTMENT.APPOINTMENT_GET_REGISTERED_USERCOUNT,
        );

        console.log("Fetch Appointments User Count API Response:", response2);

        const data2 = response2.data;

        if (data2?.success) {
          // toast.success(data2?.message);
          console.log("Fetch Appointments User Count Success:", data2?.message);

          let count = Number(
            data2?.count ?? data2?.totalUsers ?? data2?.data ?? 0,
          );
          if (isNaN(count)) count = 0;

          if (mounted) setPatientCount(count);
        } else {
          toast.warn(data2?.message || "Patient count fetched with warning");
          console.warn(
            "Fetch Appointments User Count Warning:",
            data2?.message,
          );
        }
      } catch (error2) {
        toast.error(
          error2?.response?.data?.message ||
            error2?.message ||
            "Failed to load patient count",
        );
        console.error("Fetch Appointments User Count Error:", error2);

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

  const totals = useMemo(() => {
    const totalDoctors = doctors.length;
    const totalAppointments = doctors.reduce(
      (s, d) => s + safeNumber(d.appointments?.total, 0),
      0,
    );
    const totalEarnings = doctors.reduce(
      (s, d) => s + safeNumber(d.earnings, 0),
      0,
    );
    const completed = doctors.reduce(
      (s, d) => s + safeNumber(d.appointments?.completed, 0),
      0,
    );
    const canceled = doctors.reduce(
      (s, d) => s + safeNumber(d.appointments?.canceled, 0),
      0,
    );
    const totalLoginPatients =
      doctors.reduce((s, d) => s + (d.raw?.loginPatientsCount ?? 0), 0) || 0;
    return {
      totalDoctors,
      totalAppointments,
      totalEarnings,
      completed,
      canceled,
      totalLoginPatients,
    };
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (!query) return doctors;
    const q = query.trim().toLowerCase();
    const qNum = Number(q);
    return doctors.filter((d) => {
      if (d.name.toLowerCase().includes(q)) return true;
      if ((d.specialization || "").toLowerCase().includes(q)) return true;
      if (d.fee.toString().includes(q)) return true;
      if (!Number.isNaN(qNum) && d.fee <= qNum) return true;
      return false;
    });
  }, [doctors, query]);

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
              Overview of doctors & appointments
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

              <tbody className="bg-white divide-y divide-blue-50">
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
