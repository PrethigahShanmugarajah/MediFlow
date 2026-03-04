// MediFlow / Client / src / pages / doctor / DoctorDashboard / Service / DoctorDashboardService.jsx
import { fetchAppointmentsByDoctor } from "../../../../services/fetch";
import { updateAppointment } from "../../../../services/mutations";
import {
  extractAppointments,
  frontendToBackendStatus,
  mergeRescheduledAppointment,
  mergeUpdatedAppointment,
  to12HourFrom24,
} from "../../../../utils/doctor/doctorDashboardUtils";

/* -------- Fetch appointments for doctor -------- */
export async function fetchDoctorAppointmentsApi(doctorId) {
  if (!doctorId) return [];
  const data = await fetchAppointmentsByDoctor(doctorId);
  return extractAppointments(data);
}

/* -------- Update status (optimistic + merge) -------- */
export async function updateAppointmentStatusApi({
  prevAppointments,
  id,
  newStatusFrontend,
}) {
  const appt = prevAppointments.find((p) => p.id === id);
  if (!appt) return { ok: false, appointments: prevAppointments };

  if (appt.status === "complete" || appt.status === "cancelled") {
    return { ok: false, appointments: prevAppointments };
  }

  const backendStatus = frontendToBackendStatus(newStatusFrontend);

  const optimistic = prevAppointments.map((p) =>
    p.id === id ? { ...p, status: newStatusFrontend } : p,
  );

  try {
    const data = await updateAppointment(id, { status: backendStatus });
    const updated = data?.appointment || data;

    const merged = mergeUpdatedAppointment(
      optimistic,
      id,
      updated,
      backendStatus,
    );

    return { ok: true, appointments: merged };
  } catch (error) {
    const rolledBack = prevAppointments.map((p) =>
      p.id === id ? { ...p, status: appt.status } : p,
    );

    return {
      ok: false,
      appointments: rolledBack,
      error,
      message:
        error?.message ||
        "Unable to update the appointment status at this time. Please try again.",
    };
  }
}

/* -------- Reschedule (optimistic + merge) -------- */
export async function rescheduleAppointmentApi({
  prevAppointments,
  id,
  newDate,
  newTime24,
}) {
  const appt = prevAppointments.find((p) => p.id === id);
  if (!appt) return { ok: false, appointments: prevAppointments };

  if (appt.status === "complete" || appt.status === "cancelled") {
    return { ok: false, appointments: prevAppointments };
  }

  const hhmm = newTime24;
  const time12 = to12HourFrom24(hhmm);

  const optimistic = prevAppointments.map((p) =>
    p.id === id
      ? { ...p, date: newDate, time: hhmm, status: "rescheduled" }
      : p,
  );

  try {
    const data = await updateAppointment(id, { date: newDate, time: time12 });
    const updated = data?.appointment || data;

    const merged = mergeRescheduledAppointment(
      optimistic,
      id,
      newDate,
      hhmm,
      updated,
    );

    return { ok: true, appointments: merged };
  } catch (error) {
    return {
      ok: false,
      appointments: prevAppointments,
      error,
      message:
        error?.message ||
        "Unable to reschedule the appointment at this time. Please try again.",
    };
  }
}
