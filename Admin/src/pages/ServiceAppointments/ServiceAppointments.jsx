// MediFlow / Admin / src / pages / ServiceAppointments / ServiceAppointments.jsx
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import "./ServiceAppointments.css";
import {
  filterAppointments,
  formatDateNice,
  getAppointmentTimestamp,
} from "../../utils/serviceAppointmentsUtils";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import {
  cancelAppointmentApi,
  changeAppointmentStatusApi,
  loadServiceAppointmentsApi,
  rescheduleAppointmentApi,
} from "./Service/ServiceAppointmentsService";
import Header from "./Components/Header";
import Card from "./Components/Card";
import DeletePopup from "../../components/DeletePopup";
import ShowMoreButton from "../../components/ShowMoreButton";

const ServiceAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cancelPopupOpen, setCancelPopupOpen] = useState(false);
  const [selectedCancelAppt, setSelectedCancelAppt] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [statusPopupOpen, setStatusPopupOpen] = useState(false);
  const [selectedStatusAppt, setSelectedStatusAppt] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 220);
    return () => clearTimeout(t);
  }, [search]);

  const [statusFilter, setStatusFilter] = useState("");
  const [showAll, setShowAll] = useState(false);

  async function fetchServiceAppointmentsService() {
    await loadServiceAppointmentsApi(setAppointments, setError, setLoading);
  }

  useEffect(() => {
    fetchServiceAppointmentsService();
  }, []);

  async function changeStatusRemote(id, newStatus) {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;

    if (appt.status === "Completed" || appt.status === "Canceled") {
      toast.warn(
        `Appointment #${id} has already been marked as ${appt.status}.`,
      );
      return;
    }

    if (newStatus === "Completed" || newStatus === "Canceled") {
      setSelectedStatusAppt(appt);
      setPendingStatus(newStatus);
      setStatusPopupOpen(true);
      return;
    }

    await changeAppointmentStatusApi(
      id,
      newStatus,
      appointments,
      setAppointments,
    );
  }

  async function rescheduleRemote(id, dateStr, time24) {
    await rescheduleAppointmentApi(
      id,
      dateStr,
      time24,
      appointments,
      setAppointments,
      fetchServiceAppointmentsService,
    );
  }

  function cancelRemote(id) {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;
    if (appt.status === "Canceled") return;

    setSelectedCancelAppt(appt);
    setCancelPopupOpen(true);
  }

  async function confirmCancel() {
    if (!selectedCancelAppt) return;

    setCancelLoading(true);

    try {
      await cancelAppointmentApi(
        selectedCancelAppt.id,
        appointments,
        setAppointments,
        fetchServiceAppointmentsService,
      );
      setCancelPopupOpen(false);
      setSelectedCancelAppt(null);
    } finally {
      setCancelLoading(false);
    }
  }

  async function confirmStatusChange() {
    if (!selectedStatusAppt || !pendingStatus) return;

    setCancelLoading(true);
    try {
      await changeAppointmentStatusApi(
        selectedStatusAppt.id,
        pendingStatus,
        appointments,
        setAppointments,
      );
      setStatusPopupOpen(false);
      setSelectedStatusAppt(null);
      setPendingStatus("");
    } finally {
      setCancelLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return filterAppointments(appointments, debouncedSearch, statusFilter);
  }, [appointments, debouncedSearch, statusFilter]);

  const displayList = useMemo(() => {
    const copy = filtered.slice();
    copy.sort(
      (x, y) => getAppointmentTimestamp(y) - getAppointmentTimestamp(x),
    );

    return showAll ? copy : copy.slice(0, 8);
  }, [filtered, showAll]);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-6 font-serif">
      <Header
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onRefresh={fetchServiceAppointmentsService}
        count={displayList.length}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {displayList.length === 0 ? (
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
            displayList.map((a) => {
              return (
                <Card
                  key={a.id}
                  a={a}
                  onChangeStatus={changeStatusRemote}
                  onReschedule={rescheduleRemote}
                  onCancel={cancelRemote}
                />
              );
            })
          )}
        </div>
      )}

      <ShowMoreButton
        total={filtered.length}
        limit={8}
        showAll={showAll}
        onToggle={() => setShowAll((prev) => !prev)}
        moreText="Show More"
        lessText="Show Less"
        showIcon
      />

      {cancelPopupOpen && selectedCancelAppt ? (
        <DeletePopup
          onClose={() => {
            if (cancelLoading) return;
            setCancelPopupOpen(false);
            setSelectedCancelAppt(null);
          }}
          onDelete={confirmCancel}
          loading={cancelLoading}
          title="Cancel Appointment?"
          confirmText="Cancel"
          closeText="No"
          description={
            <>
              Mark appointment for <b>{selectedCancelAppt.patientName}</b> on{" "}
              <b>{formatDateNice(selectedCancelAppt.date)}</b> as{" "}
              <b>CANCELED</b>?
            </>
          }
        />
      ) : null}

      {statusPopupOpen && selectedStatusAppt ? (
        <DeletePopup
          onClose={() => {
            if (cancelLoading) return;
            setStatusPopupOpen(false);
            setSelectedStatusAppt(null);
            setPendingStatus("");
          }}
          onDelete={confirmStatusChange}
          loading={cancelLoading}
          title={
            pendingStatus === "Canceled"
              ? "Cancel Appointment?"
              : "Mark as Completed?"
          }
          confirmText={
            pendingStatus === "Canceled" ? "Cancel" : "Mark Completed"
          }
          closeText="No"
          description={
            <>
              Change status for <b>{selectedStatusAppt.patientName}</b> on{" "}
              <b>{formatDateNice(selectedStatusAppt.date)}</b> to{" "}
              <b>{pendingStatus}</b>?
            </>
          }
        />
      ) : null}
    </div>
  );
};

export default ServiceAppointments;
