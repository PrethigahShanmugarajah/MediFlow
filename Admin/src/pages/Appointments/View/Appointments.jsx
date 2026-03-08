import { useEffect, useMemo, useState } from "react";
import {
  adminCancelAppointmentById,
  getAppointmentsForPage,
  reloadAppointments,
} from "../Service/AppointmentsService";
import {
  applyUpdatedAppointment,
  canAdminCancel,
  filterDoctorAppointments,
  sortAppointmentsByNewest,
} from "../../../utils/appointmentsUtils";
import AppointmentsHeader from "../Components/AppointmentsHeader";
import { ClipLoader } from "react-spinners";
import { Search } from "lucide-react";
import AppointmentCard from "../Components/AppointmentCard";
import ShowMoreButton from "../../../components/ShowMoreButton";
import DeletePopup from "../../../components/DeletePopup";
import {
  capitalizeWords,
  formatDateISO,
  formatDoctorName,
} from "../../../utils/helpers";
import "../Appointments.css";

const Appointments = () => {
  const isAdmin = true;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    async function fetchAppointmentsService() {
      setLoading(true);
      setError(null);

      try {
        const list = await getAppointmentsForPage({
          limit: 200,
          search: query.trim(),
        });

        setAppointments(list);
      } catch (error) {
        console.error("Load appointments error:", error);
        setError(error?.message || "Failed to load appointments");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointmentsService();
  }, [query]);

  const specialities = useMemo(() => {
    const set = new Set(appointments.map((a) => a.speciality || "General"));
    return ["all", ...Array.from(set)];
  }, [appointments]);

  const filtered = useMemo(
    () =>
      filterDoctorAppointments(appointments, {
        query,
        filterDate,
        filterSpeciality,
      }),
    [appointments, query, filterDate, filterSpeciality],
  );

  const sortedFiltered = useMemo(
    () => sortAppointmentsByNewest(filtered),
    [filtered],
  );

  const displayed = useMemo(
    () => (showAll ? sortedFiltered : sortedFiltered.slice(0, 8)),
    [sortedFiltered, showAll],
  );

  function openCancelPopup(appt) {
    setCancelTarget(appt);
  }

  function closeCancelPopup() {
    if (cancelLoading) return;
    setCancelTarget(null);
  }

  async function confirmCancel() {
    if (!cancelTarget) return;
    setCancelLoading(true);
    const id = cancelTarget.id;

    setAppointments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Canceled" } : p)),
    );
    setShowAll(true);

    try {
      const { updated } = await adminCancelAppointmentById(id);
      setAppointments((prev) => applyUpdatedAppointment(prev, id, updated));
      setCancelTarget(null);
    } catch (error) {
      console.error("Cancel error:", error);
      setError(error?.message || "Failed to cancel appointment");

      try {
        const list = await reloadAppointments(200);
        setAppointments(list);
      } catch (error) {
        console.error("Reload error:", error);
      }
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <div className="min-h-screen font-serif from-indigo-100 via-white to-blue-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-350 mx-auto">
        <AppointmentsHeader
          query={query}
          setQuery={setQuery}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          filterSpeciality={filterSpeciality}
          setFilterSpeciality={setFilterSpeciality}
          specialities={specialities}
          onClear={() => {
            setQuery("");
            setFilterDate("");
            setFilterSpeciality("all");
            setShowAll(false);
            setError(null);
          }}
        />

        {loading ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 px-8 py-6">
              <ClipLoader size={50} color="#6366F1" />
            </div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-600 py-6 rounded-lg">
            {error}
          </div>
        ) : sortedFiltered.length === 0 ? (
          <div className="col-span-full rounded-2xl p-8 flex items-center justify-center flex-col gap-3">
            <div className="text-3xl text-indigo-300">
              <Search />
            </div>

            <div className="text-sm text-gray-600">
              No appointments match your search
            </div>

            <div className="text-xs text-gray-400">
              Try a different patient name or service
            </div>
          </div>
        ) : (
          <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayed.map((a, idx) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                index={idx}
                isAdmin={isAdmin}
                onAdminCancel={(id) => {
                  const appt = appointments.find((x) => x.id === id);
                  if (!appt) return;
                  if (!canAdminCancel(appt.status)) return;
                  openCancelPopup(appt);
                }}
              />
            ))}
          </main>
        )}

        <ShowMoreButton
          id="sorted-show-more"
          total={sortedFiltered.length}
          limit={8}
          showAll={showAll}
          onToggle={() => setShowAll((s) => !s)}
          showIcon
        />
      </div>

      {cancelTarget && (
        <DeletePopup
          loading={cancelLoading}
          onClose={closeCancelPopup}
          onDelete={confirmCancel}
          confirmText="Cancel"
          title="Cancel Appointment"
          description={
            <>
              Are you sure you want to cancel this appointment?
              <div className="mt-2 text-center space-x-1">
                <div>
                  <b>Patient:</b> {capitalizeWords(cancelTarget.patientName)}
                </div>
                <div>
                  <b>Doctor:</b> {formatDoctorName(cancelTarget.doctorName)}
                </div>
                <div>
                  <b>Date:</b> {formatDateISO(cancelTarget.slot?.date)}
                </div>
                <div>
                  <b>Time:</b> {cancelTarget.slot?.time}
                </div>
              </div>
              <div className="mt-2">This action cannot be undone.</div>
            </>
          }
        />
      )}
    </div>
  );
};

export default Appointments;
