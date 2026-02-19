// MediFlow / Admin / src / components / AppointmentsPage / AppointmentsPage.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import API_ROUTES from "../../api/api_route";
import { useForm } from "react-hook-form";
import { Banknote, Calendar, Search } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  filterAppointments,
  formatDateISO,
  getSpecialities,
  isAppointmentLocked,
  loadAppointmentsData,
  markAppointmentCanceled,
  sortAppointmentsBySlotDesc,
} from "./Services";
import { fetchAppointments } from "../../services/fetch";
import "./AppointmentsPage.css";
import DeletePopup from "../DeletePopup/DeletePopup";
import { InputField, SelectInput } from "../FormField/FormField";

const AppointmentsPage = () => {
  const isAdmin = true;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: "",
      date: "",
    },
  });

  const query = watch("search");

  useEffect(() => {
    async function loadAppointments() {
      setLoading(true);
      setError(null);

      try {
        const items = await loadAppointmentsData(fetchAppointments, {
          limit: 200,
        });
        setAppointments(items);
      } catch (err) {
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, []);

  const specialities = useMemo(
    () => getSpecialities(appointments),
    [appointments],
  );

  const specialityOptions = useMemo(
    () =>
      specialities.map((s) => ({
        value: s,
        label: s === "all" ? "All Specialties" : s,
      })),
    [specialities],
  );

  const filtered = useMemo(
    () => filterAppointments(appointments, query, filterDate, filterSpeciality),
    [appointments, query, filterDate, filterSpeciality],
  );

  const sortedFiltered = useMemo(
    () => sortAppointmentsBySlotDesc(filtered),
    [filtered],
  );

  const displayed = useMemo(
    () => (showAll ? sortedFiltered : sortedFiltered.slice(0, 8)),
    [sortedFiltered, showAll],
  );

  async function adminCancelAppointment() {
    if (!cancelTarget) return;

    const id = cancelTarget.id;

    const statusLower = (cancelTarget.status || "").toLowerCase();
    const isCancelled =
      statusLower === "canceled" || statusLower === "cancelled";
    const isCompleted = statusLower === "completed";
    if (isCancelled || isCompleted) {
      setCancelTarget(null);
      return;
    }

    setCancelLoading(true);

    try {
      setAppointments((prev) => markAppointmentCanceled(prev, id));

      const response1 = await api.post(
        API_ROUTES.APPOINTMENT.APPOINTMENT_CANCEL(id),
      );

      console.log("Cancel Appointment API Response:", response1);

      const data1 = response1.data;

      if (data1?.success) {
        toast.success(data1?.message);
        console.log("Cancel Appointment Success:", data1?.message);

        setCancelTarget(null);
        return;
      } else {
        toast.warn(data1?.message || "Cancel Appointment with warning");
        console.warn("Cancel Appointment Warning:", data1?.message);

        throw new Error(data1?.message);
      }
    } catch (error1) {
      toast.error(error1?.response?.data?.message || error1?.message);
      console.error("Cancel Appointment Error:", error1);

      try {
        const items = await loadAppointmentsData(fetchAppointments, {
          limit: 200,
        });
        setAppointments(items);
      } catch (error2) {
        toast.error(error2?.response?.data?.message || error2?.message);
        console.error("Fetch Appointments Error:", error2);
      }
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <div className="min-h-screen font-serif bg-linear-to-br from-blue-50 via-blue-100 to-white p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-350 mx-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-semibold text-indigo-800">
              Appointments
            </h1>
            <p className="text-xs sm:text-sm text-indigo-600">
              Organize and find upcoming patient appointments
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <div className="flex flex-col md:flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm w-full sm:w-72 gap-1.5">
                <Search size={16} className="text-indigo-400" />

                <div className="flex-1">
                  <InputField
                    unstyled
                    control={control}
                    name="search"
                    type="text"
                    placeholder="Search doctors, patient, speciality..."
                    inputClassName="text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center flex-col md:flex-row lg:flex-row gap-2 w-full sm:w-auto">
                <div className="bg-white rounded-full px-3 py-2 shadow-sm flex items-center gap-2 w-full sm:w-auto">
                  <Calendar size={14} className="text-indigo-400" />
                  <InputField
                    unstyled
                    control={control}
                    name="filterDate"
                    type="date"
                    inputClassName="text-sm text-indigo-700 bg-transparent w-full"
                  />
                </div>

                <SelectInput
                  control={control}
                  name="filterSpeciality"
                  options={specialityOptions}
                  placeholder="All Specialties"
                  className="w-full sm:w-auto"
                  selectClassName="w-full sm:w-auto text-sm"
                />

                <button
                  onClick={() => {
                    setValue("search", "");
                    setValue("filterDate", "");
                    setValue("filterSpeciality", "all");
                    setShowAll(false);
                    setError(null);
                  }}
                  className="ml-0 sm:ml-2 px-3 cursor-pointer py-2 rounded-full bg-indigo-600 text-white text-sm shadow-sm hover:opacity-95 transition w-full sm:w-auto"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <>
            <div className="col-span-full flex text-center items-center justify-center  text-black py-8 gap-3">
              <ClipLoader size={18} color="#3B82F6" />
              <span className="text-sm animate-pulse">
                Loading Appointments...
              </span>
            </div>
          </>
        ) : error ? (
          <div className="col-span-full text-center text-red-600 py-6 rounded-lg bg-white/60 border border-red-100">
            {error}
          </div>
        ) : sortedFiltered.length === 0 ? (
          <div className="col-span-full text-center text-indigo-600 py-12 rounded-lg bg-white/60 border border-indigo-100">
            No appointments found.
          </div>
        ) : (
          <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayed.map((a, idx) => {
              const isDisabled = isAppointmentLocked(a.status);
              const isCompleted =
                String(a.status).toLowerCase() === "completed";

              return (
                <div
                  key={a.id}
                  style={{
                    animation: `fadeUp 420ms cubic-bezier(.2,.9,.2,1) forwards`,
                    animationDelay: `${idx * 70}ms`,
                    opacity: 0,
                  }}
                  className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm border border-indigo-100 flex flex-col gap-3 hover:shadow-md transform hover:-translate-y-1 transition"
                >
                  <div className="flex items-start lg:line-clamp-2 justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-medium text-indigo-800 truncate">
                          {a.patientName}
                        </h3>

                        <div className="text-xs sm:text-sm text-indigo-500 flex items-center gap-2">
                          <span>{a.age ? `${a.age} yrs` : ""}</span>
                          <span> {a.age ? ":" : ""} </span>
                          <span>{a.gender}</span>
                          <span className="hidden md:inline"> : </span>
                          <span className=" max-w-30">{a.mobile}</span>
                        </div>
                      </div>

                      <div className="mt-1 text-xs sm:text-sm text-indigo-600 truncate">
                        {a.doctorName} :{" "}
                        <span className="font-medium text-indigo-700">
                          {a.speciality}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-nd lg:pt-3 lg:justify-start flex items-center font-bold text-indigo-700 text-xs sm:text-sm">
                        Fees
                      </div>
                      <div className="text-lg sm:text-xl font-semibold lg:justify-start text-indigo-800 flex items-center justify-end gap-1">
                        <Banknote size={16} />
                        <span>{a.fee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="inline-flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      <Calendar size={14} className="text-indigo-400" />
                      <span>
                        {formatDateISO(a.slot.date)} — {a.slot.time}
                      </span>
                    </div>

                    <div
                      className={`text-xs px-3 py-1 rounded-full ${
                        a.status?.toLowerCase() === "confirmed"
                          ? "bg-sky-50 text-sky-700 border border-sky-100"
                          : a.status?.toLowerCase() === "completed"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                            : a.status?.toLowerCase() === "rescheduled"
                              ? "bg-lime-50 text-lime-700 border border-lime-100"
                              : a.status?.toLowerCase() === "canceled" ||
                                  a.status?.toLowerCase() === "cancelled"
                                ? "bg-red-50 text-red-700 border border-red-100"
                                : "bg-pink-50 text-pink-700 border border-pink-100"
                      }`}
                    >
                      {a.status ? a.status.toUpperCase() : "PENDING"}
                    </div>

                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <button
                          onClick={() => setCancelTarget(a)}
                          title={
                            isDisabled
                              ? isCompleted
                                ? "Cannot cancel a completed appointment"
                                : "Already cancelled"
                              : "Admin Cancel (mark as cancelled)"
                          }
                          disabled={isDisabled}
                          aria-disabled={isDisabled}
                          className={`px-3 py-2 rounded-full text-sm flex items-center gap-2 transition ${
                            isDisabled
                              ? "bg-red-50 text-red-400 opacity-60 cursor-not-allowed"
                              : "bg-red-50 text-red-700 hover:scale-105 cursor-pointer"
                          }`}
                        >
                          {isDisabled
                            ? isCompleted
                              ? "Completed"
                              : "Admin Cancelled"
                            : "Admin Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </main>
        )}

        {sortedFiltered.length > 8 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAll((s) => !s)}
              className="px-4 py-2 rounded-full bg-white border border-indigo-200 shadow-sm hover:shadow-md transition"
            >
              {showAll
                ? "Show Less"
                : `Show more (${sortedFiltered.length - 8})`}
            </button>
          </div>
        )}
      </div>

      {cancelTarget && (
        <DeletePopup
          title="Cancel appointment?"
          message={
            <>
              Do you want to cancel this appointment?
              <br />
              <br />
              Patient: <b>{cancelTarget.patientName}</b> <br />
              Doctor: <b>{cancelTarget.doctorName}</b> <br />
              Date: <b>{formatDateISO(cancelTarget.slot.date)}</b> <br />
              Time: <b>{cancelTarget.slot.time}</b> <br />
              <br />
              This action cannot be undone.
            </>
          }
          confirmText="Cancel"
          loading={cancelLoading}
          onClose={() => !cancelLoading && setCancelTarget(null)}
          onDelete={adminCancelAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
