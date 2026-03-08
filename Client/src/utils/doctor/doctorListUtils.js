import {
  normalizeAppointment,
  normalizeAppointmentsFromResponse,
  parseDateTime,
} from "./doctorHelpers";

/* -------- Normalize appointments list -------- */
export function normalizeAppointmentsList(body) {
  return normalizeAppointmentsFromResponse(body);
}
/* -------- Filter + sort appointments (latest first) -------- */
export function filterAndSortAppointments(appointments, search, statusFilter) {
  const q = String(search || "")
    .trim()
    .toLowerCase();

  return [...(Array.isArray(appointments) ? appointments : [])]
    .filter((a) =>
      q
        ? String(a?.patient || "")
            .toLowerCase()
            .includes(q)
        : true,
    )
    .filter((a) => (statusFilter ? a?.status === statusFilter : true))
    .sort(
      (a, b) =>
        parseDateTime(b?.date, b?.time) - parseDateTime(a?.date, a?.time),
    );
}

/* -------- Optimistic state helpers -------- */
export function optimisticStatusUpdate(prev, id, newStatus) {
  return prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p));
}

export function optimisticRescheduleUpdate(prev, id, newDate, newTime24) {
  return prev.map((p) =>
    p.id === id
      ? { ...p, date: newDate, time: newTime24, status: "rescheduled" }
      : p,
  );
}

/* -------- Replace single updated appointment safely -------- */
export function mergeDoctorListUpdatedAppointment(
  prev,
  id,
  updated,
  fallbackPatch = {},
) {
  const normalized = normalizeAppointment(updated);
  return prev.map((p) =>
    p.id === id ? (normalized ? normalized : { ...p, ...fallbackPatch }) : p,
  );
}

/* -------- Smart Doctor Name Formatter -------- */
export const statusOptions = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "complete", label: "Completed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rescheduled", label: "Rescheduled" },
];
