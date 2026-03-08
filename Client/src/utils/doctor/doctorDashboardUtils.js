import {
  backendToFrontendStatus,
  normalizeAppointment,
  normalizeAppointmentsFromResponse,
  parseDateTime,
} from "./doctorHelpers";

/* -------- Sort appointments by latest date and time -------- */
export function sortAppointmentsByDate(appointments) {
  return [...appointments].sort(
    (a, b) => parseDateTime(b.date, b.time) - parseDateTime(a.date, a.time),
  );
}

/* -------- Dashboard Stats -------- */
export function calculateAppointmentStats(appointments) {
  const totalAppointments = appointments.length;

  const completedAppointments = appointments.filter(
    (a) => a.status === "complete",
  ).length;

  const cancelledAppointments = appointments.filter(
    (a) => a.status === "cancelled",
  ).length;

  const totalEarnings = appointments
    .filter((a) => a.status === "complete")
    .reduce((sum, a) => sum + (Number(a.fee) || 0), 0);

  return {
    totalAppointments,
    completedAppointments,
    cancelledAppointments,
    totalEarnings,
  };
}

/* -------- Doctor Name Extractor -------- */
export function getDoctorNameFromAppointments(appointments) {
  return (
    appointments?.[0]?.raw?.doctorId?.name ||
    appointments?.[0]?.raw?.doctorName ||
    null
  );
}

/* -------- Extract & Normalize API Appointment Data -------- */
export function extractAppointments(data) {
  return normalizeAppointmentsFromResponse(data);
}

/* -------- Merge Updated Appointment Data -------- */
export function mergeDashboardUpdatedAppointment(
  prev,
  id,
  updated,
  backendStatus,
) {
  return prev.map((p) => {
    if (p.id !== id) return p;

    const mergedRaw = { ...(p.raw || {}), ...(updated || {}) };

    const normalized = normalizeAppointment(mergedRaw);

    if (normalized) return normalized;

    return {
      ...p,
      status: backendToFrontendStatus(updated?.status || backendStatus),
      raw: mergedRaw,
    };
  });
}

/* -------- Merge Rescheduled Appointment Data -------- */
export function mergeRescheduledAppointment(
  prev,
  id,
  newDate,
  newTime,
  updated,
) {
  return prev.map((p) => {
    if (p.id !== id) return p;

    const mergedRaw = { ...(p.raw || {}), ...(updated || {}) };

    const normalized = normalizeAppointment(mergedRaw);

    if (normalized) return normalized;

    return {
      ...p,
      date: newDate,
      time: newTime,
      status: backendToFrontendStatus(updated?.status || "Rescheduled"),
      raw: mergedRaw,
    };
  });
}
