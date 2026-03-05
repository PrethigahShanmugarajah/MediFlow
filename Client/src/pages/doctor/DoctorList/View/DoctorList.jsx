// MediFlow / Client / src / pages / doctor / DoctorList / View / DoctorList.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { filterAndSortAppointments } from "../../../../utils/doctor/doctorListUtils";
import {
  fetchDoctorAppointmentsApi,
  rescheduleAppointmentApi,
  updateAppointmentStatusApi,
} from "../Service/DoctorListService";
import Header from "../Components/Header";
import DetailPageLoader from "../../../../components/common/DetailPageLoader";
import ApiError from "../../../../components/common/ApiError";
import Card from "../Components/Card";

const DoctorList = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const doctorId = params.id;

  async function fetchAppointmentsService() {
    setLoading(true);
    setError(null);
    try {
      const normalized = await fetchDoctorAppointmentsApi(doctorId);
      setAppointments(normalized);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load appointments at this time. Please try again later.",
      );
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!doctorId) return;
    fetchAppointmentsService();
  }, [doctorId]);

  const retry = () => {
    if (!doctorId) return;
    fetchAppointmentsService();
  };

  async function updateStatusRemote(id, newStatus) {
    const result = await updateAppointmentStatusApi({
      prevAppointments: appointments,
      id,
      newStatusFrontend: newStatus,
    });

    setAppointments(result.appointments);

    if (!result.ok) {
      setError(
        result?.message ||
          "Unable to update the appointment status at this time. Please try again.",
      );
    }
  }

  async function rescheduleRemote(id, newDate, newTime24) {
    const result = await rescheduleAppointmentApi({
      prevAppointments: appointments,
      id,
      newDate,
      newTime24,
    });

    setAppointments(result.appointments);

    if (!result.ok) {
      setError(
        result?.message ||
          "Unable to reschedule the appointment. Reloading the latest data.",
      );
      await fetchAppointmentsService();
    }
  }

  function updateStatus(id, newStatus) {
    updateStatusRemote(id, newStatus);
  }

  function updateDateTime(id, newDate, newTime) {
    rescheduleRemote(id, newDate, newTime);
  }

  const filtered = useMemo(() => {
    return filterAndSortAppointments(appointments, search, statusFilter);
  }, [appointments, search, statusFilter]);

  return (
    <div className="min-h-screen pt-20 md:pt-25 lg:pt-25 font-serif p-4 sm:p-6 bg-linear-to-br from-blue-100 via-white to-indigo-100">
      <div className="max-w-7xl mx-auto">
        <Header
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {loading ? (
          <DetailPageLoader />
        ) : error ? (
          <ApiError message={error} onRetry={retry} retryText="Retry" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {filtered.map((a) => (
              <Card
                key={a.id}
                appointment={a}
                onStatusChange={(s) => updateStatus(a.id, s)}
                onReschedule={(d, t) => updateDateTime(a.id, d, t)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
