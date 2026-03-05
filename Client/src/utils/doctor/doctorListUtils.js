// MediFlow / Client / src / utils / doctor / doctorListUtils.js

/* -------- Convert date + time to Date object -------- */
export function parseDateTime(date, time) {
  return new Date(`${date}T${time}:00`);
}

/* -------- Convert 24h time to AM/PM format -------- */
export function formatTimeAMPM(time24) {
  if (!time24) return "";
  const [hh, mm] = time24.split(":");
  let h = parseInt(hh, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${mm} ${ampm}`;
}

/* -------- Format date to readable text -------- */
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* -------- Convert 12h/unknown time to 24h -------- */
export function to24HourFromMaybe12(timeStr) {
  if (!timeStr) return "00:00";
  const m = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return timeStr;
  let hh = Number(m[1]);
  const mm = m[2];
  const ampm = m[3];
  if (!ampm) return `${String(hh).padStart(2, "0")}:${mm}`;
  const up = ampm.toUpperCase();
  if (up === "AM") {
    if (hh === 12) hh = 0;
  } else {
    if (hh !== 12) hh += 12;
  }
  return `${String(hh).padStart(2, "0")}:${mm}`;
}

/* -------- Convert 24h time to 12h format -------- */
export function to12HourFrom24(hhmm) {
  if (!hhmm) return "12:00 AM";
  const [hh, mm] = hhmm.split(":").map(Number);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${String(h12)}:${String(mm).padStart(2, "0")} ${ampm}`;
}

/* -------- Convert backend status to frontend -------- */
export function backendToFrontendStatus(s) {
  if (!s) return "pending";
  const v = String(s).toLowerCase();
  if (v === "pending") return "pending";
  if (v === "confirmed") return "confirmed";
  if (v === "completed" || v === "complete") return "complete";
  if (v === "canceled" || v === "cancelled") return "cancelled";
  if (v === "rescheduled") return "rescheduled";
  return v;
}

/* -------- Convert frontend status to backend -------- */
export function frontendToBackendStatus(fs) {
  if (!fs) return "Pending";
  const v = String(fs).toLowerCase();
  if (v === "pending") return "Pending";
  if (v === "confirmed") return "Confirmed";
  if (v === "complete") return "Completed";
  if (v === "cancelled") return "Canceled";
  if (v === "rescheduled") return "Rescheduled";
  return fs;
}

/* -------- Normalize appointment object -------- */
export function normalizeAppointment(a) {
  if (!a) return null;
  const id = a._id || a.id || String(Math.random()).slice(2);
  const patient = a.patientName || a.patient || a.name || "Unknown";
  const age = a.age ?? a.patientAge ?? "";
  const gender = a.gender || "";
  const doctorName =
    (a.doctorId && a.doctorId.name) || a.doctorName || a.doctor || "";
  const doctorImage =
    (a.doctorId && (a.doctorId.imageUrl || a.doctorId.image)) ||
    a.doctorImage ||
    a.doctorImageUrl ||
    "";
  const speciality =
    (a.doctorId && (a.doctorId.specialization || a.doctorId.speciality)) ||
    a.speciality ||
    a.specialization ||
    "";
  const mobile = a.mobile || a.phone || "";
  const fee = Number(a.fees ?? a.fee ?? a.payment?.amount ?? 0) || 0;
  const date = a.date || (a.slot && a.slot.date) || "";
  const rawTime =
    a.time ||
    (a.slot && a.slot.time) ||
    (a.hour != null
      ? `${String(a.hour).padStart(2, "0")}:${String(a.minute || 0).padStart(
          2,
          "0",
        )}`
      : "");
  const time = to24HourFromMaybe12(rawTime);
  const status = backendToFrontendStatus(
    a.status || a.payment?.status || "pending",
  );
  return {
    id,
    patient,
    age,
    gender,
    doctorName,
    doctorImage,
    speciality,
    mobile,
    date,
    time,
    fee,
    status,
    raw: a,
  };
}

/* -------- Extract array safely from API response -------- */
export function extractAppointmentsList(body) {
  if (!body) return [];
  if (Array.isArray(body?.appointments)) return body.appointments;
  if (Array.isArray(body)) return body;
  return body?.items ?? body?.data ?? [];
}

/* -------- Normalize appointments list -------- */
export function normalizeAppointmentsList(body) {
  const list = extractAppointmentsList(body);
  return (Array.isArray(list) ? list : [])
    .map(normalizeAppointment)
    .filter(Boolean);
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
export function mergeUpdatedAppointment(prev, id, updated, fallbackPatch = {}) {
  const normalized = normalizeAppointment(updated);
  return prev.map((p) =>
    p.id === id ? (normalized ? normalized : { ...p, ...fallbackPatch }) : p,
  );
}

/* -------- Capitalize each word -------- */
export function formatPatientName(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/* -------- Smart Doctor Name Formatter -------- */
export function formatDoctorName(name) {
  if (!name) return "";

  let trimmed = name.trim();

  trimmed = trimmed.replace(/\s+/g, " ");

  const capitalizeWords = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  if (/^prof\.?\s+dr\.?/i.test(trimmed)) {
    return capitalizeWords(trimmed);
  }

  if (/^dr\.?/i.test(trimmed)) {
    const withoutDuplicate = trimmed.replace(/^dr\.?\s*/i, "");
    return `Dr. ${capitalizeWords(withoutDuplicate)}`;
  }

  return `Dr. ${capitalizeWords(trimmed)}`;
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
