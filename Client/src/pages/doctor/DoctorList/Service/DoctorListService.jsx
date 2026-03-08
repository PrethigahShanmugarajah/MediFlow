import { fetchAppointmentsByDoctor } from "../../../../services/fetch";
import { updateAppointment } from "../../../../services/mutations";
import {
  backendToFrontendStatus,
  frontendToBackendStatus,
  to12HourFrom24,
} from "../../../../utils/doctor/doctorHelpers";
import {
  mergeDoctorListUpdatedAppointment,
  normalizeAppointmentsList,
  optimisticRescheduleUpdate,
  optimisticStatusUpdate,
} from "../../../../utils/doctor/doctorListUtils";

export async function fetchDoctorAppointmentsApi(doctorId) {
  if (!doctorId) return [];
  const data = await fetchAppointmentsByDoctor(doctorId);
  return normalizeAppointmentsList(data);
}

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

  const optimistic = optimisticStatusUpdate(
    prevAppointments,
    id,
    newStatusFrontend,
  );

  try {
    const data = await updateAppointment(id, { status: backendStatus });
    const updated = data?.appointment || data;

    const merged = mergeDoctorListUpdatedAppointment(optimistic, id, updated, {
      status: backendToFrontendStatus(updated?.status || backendStatus),
    });

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

  const time12 = to12HourFrom24(newTime24);

  const optimistic = optimisticRescheduleUpdate(
    prevAppointments,
    id,
    newDate,
    newTime24,
  );

  try {
    const data = await updateAppointment(id, { date: newDate, time: time12 });
    const updated = data?.appointment || data;

    const merged = mergeDoctorListUpdatedAppointment(optimistic, id, updated, {
      date: newDate,
      time: newTime24,
      status: backendToFrontendStatus(updated?.status || "Rescheduled"),
    });

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
