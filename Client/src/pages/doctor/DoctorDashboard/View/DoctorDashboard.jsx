// MediFlow / Client / src / pages / doctor / DoctorDashboard / View / DoctorDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Calendar } from "lucide-react";
import {
  calculateAppointmentStats,
  formatPatientName,
  getDoctorNameFromAppointments,
  sortAppointmentsByDate,
} from "../../../../utils/doctor/doctorDashboardUtils";
import { BeatLoader, ScaleLoader } from "react-spinners";
import ViewCard from "../Components/ViewCard";
import {
  fetchDoctorAppointmentsApi,
  rescheduleAppointmentApi,
  updateAppointmentStatusApi,
} from "../Service/DoctorDashboardService";
import ShowMoreButton from "../../../../components/common/ShowMoreButton";
import Header from "../Components/Header";
import StatsSection from "../Components/StatsSection";
import DeletePopup from "../../../../components/common/DeletePopup";

const DoctorDashboard = () => {
  const params = useParams();
  const location = useLocation();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [statusPopupOpen, setStatusPopupOpen] = useState(false);
  const [selectedStatusAppt, setSelectedStatusAppt] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  const doctorId = params.id;

  async function fetchAppointmentsService() {
    setLoading(true);
    setError(null);

    try {
      const normalized = await fetchDoctorAppointmentsApi(doctorId);
      setAppointments(normalized);
    } catch (error) {
      console.error("fetchAppointments:", error);
      setError(
        error?.message ||
          "Unable to load appointments at this time. Please try again later.",
      );
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointmentsService();
  }, [doctorId, location.search]);

  const sorted = useMemo(
    () => sortAppointmentsByDate(appointments),
    [appointments],
  );

  const visibleAppointments = showAll ? sorted : sorted.slice(0, 8);

  const {
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    totalEarnings,
  } = calculateAppointmentStats(appointments);

  async function updateStatusRemote(id, newStatusFrontend) {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;

    const isLocked = appt.status === "complete" || appt.status === "cancelled";
    if (isLocked) return;

    if (newStatusFrontend === "complete" || newStatusFrontend === "cancelled") {
      setSelectedStatusAppt(appt);
      setPendingStatus(newStatusFrontend);
      setStatusPopupOpen(true);
      return;
    }
    const {
      ok,
      appointments: next,
      message,
    } = await updateAppointmentStatusApi({
      prevAppointments: appointments,
      id,
      newStatusFrontend,
    });
    setAppointments(next);
    if (!ok && message) {
      setError(message);
    }
  }

  async function rescheduleRemote(id, newDate, newTime24) {
    const {
      ok,
      appointments: next,
      message,
    } = await rescheduleAppointmentApi({
      prevAppointments: appointments,
      id,
      newDate,
      newTime24,
    });
    setAppointments(next);
    if (!ok && message) {
      setError(message);
      await fetchAppointmentsService();
    }
  }

  async function confirmStatusChange() {
    if (!selectedStatusAppt || !pendingStatus) return;

    setStatusLoading(true);
    try {
      const {
        ok,
        appointments: next,
        message,
      } = await updateAppointmentStatusApi({
        prevAppointments: appointments,
        id: selectedStatusAppt.id,
        newStatusFrontend: pendingStatus,
      });

      setAppointments(next);

      if (!ok && message) {
        setError(message);
      }
      setStatusPopupOpen(false);
      setSelectedStatusAppt(null);
      setPendingStatus("");
    } finally {
      setStatusLoading(false);
    }
  }

  function updateStatus(id, newStatus) {
    updateStatusRemote(id, newStatus);
  }

  function updateDateTime(id, newDate, newTime) {
    rescheduleRemote(id, newDate, newTime);
  }

  const doctorNameFromData = getDoctorNameFromAppointments(appointments);

  return (
    <div className="min-h-screen font-serif pt-16 lg:pt-20 md:pt-15 p-4 sm:p-6 bg-linear-to-br from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto">
        <Header
          doctorName={doctorNameFromData}
          doctorId={doctorId}
          loading={loading}
          totalAppointments={appointments.length}
          onRefresh={fetchAppointmentsService}
        />

        <StatsSection
          totalAppointments={totalAppointments}
          completedAppointments={completedAppointments}
          cancelledAppointments={cancelledAppointments}
          totalEarnings={totalEarnings}
        />

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-indigo-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-indigo-900">
              Latest Appointments
            </h2>
            <div className="flex items-center gap-3">
              <div className="text-sm sm:text-base text-indigo-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {loading ? (
                  <BeatLoader size={6} color="#6366F1" />
                ) : (
                  <span>{totalAppointments} total</span>
                )}
              </div>
            </div>
          </div>

          {/* -------- Cards grid -------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
            {loading ? (
              <div className="col-span-full flex justify-center py-10">
                <ScaleLoader height={28} width={4} color="#6366F1" />
              </div>
            ) : (
              visibleAppointments.map((a) => (
                <ViewCard
                  key={a.id}
                  appointment={a}
                  onUpdateStatus={updateStatus}
                  onReschedule={updateDateTime}
                />
              ))
            )}
          </div>

          {!loading && (
            <ShowMoreButton
              id="doctor-dashboard-appointments"
              total={sorted.length}
              limit={8}
              moreText="Show More"
              showRemainingCount={false}
              alwaysShow
              to={
                doctorId
                  ? `/doctor-admin/${doctorId}/appointments`
                  : "/appointments"
              }
            />
          )}
        </div>
      </div>

      {statusPopupOpen && selectedStatusAppt ? (
        <DeletePopup
          loading={statusLoading}
          onClose={() => {
            if (statusLoading) return;
            setStatusPopupOpen(false);
            setSelectedStatusAppt(null);
            setPendingStatus("");
          }}
          onDelete={confirmStatusChange}
          title={
            pendingStatus === "cancelled"
              ? "Cancel Appointment?"
              : "Mark as Completed?"
          }
          confirmText={
            pendingStatus === "cancelled" ? "Cancel" : "Mark Completed"
          }
          description={
            <>
              Change status for{" "}
              <b>{formatPatientName(selectedStatusAppt.patient)}</b> to{" "}
              <b>{pendingStatus === "cancelled" ? "CANCELLED" : "COMPLETED"}</b>
              ?
            </>
          }
        />
      ) : null}
    </div>
  );
};

export default DoctorDashboard;
