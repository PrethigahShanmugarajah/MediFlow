import { NoPersonImage } from "../../assets";

/* -------- Create Date object from date and time -------- */
export function parseDateTime(date, time) {
  return new Date(`${date}T${time}:00`);
}

/* -------- Convert 24-hour time to AM/PM format -------- */
export function formatTimeAMPM(time24) {
  if (!time24) return "";

  const [hh, mm] = time24.split(":");

  let h = parseInt(hh, 10);
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12 || 12;

  return `${h}:${mm} ${ampm}`;
}

/* -------- Format date to readable UK format -------- */
export function formatDate(dateStr) {
  if (!dateStr) return "";

  const d = new Date(`${dateStr}T00:00:00`);

  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* -------- Convert frontend status to backend format -------- */
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

/* -------- Convert 24-hour time to 12-hour format -------- */
export function to12HourFrom24(hhmm) {
  if (!hhmm) return "12:00 AM";
  const [hh, mm] = hhmm.split(":").map(Number);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${String(h12)}:${String(mm).padStart(2, "0")} ${ampm}`;
}

/* -------- Convert 12h or 24h time string to 24-hour format -------- */
export function to24Hour(timeStr) {
  if (!timeStr) return "00:00";

  const m = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return timeStr;

  let hh = Number(m[1]);
  const mm = m[2];
  const ampm = m[3];

  if (!ampm) {
    return `${String(hh).padStart(2, "0")}:${mm}`;
  }

  const up = ampm.toUpperCase();

  if (up === "AM") {
    if (hh === 12) hh = 0;
  } else {
    if (hh !== 12) hh += 12;
  }

  return `${String(hh).padStart(2, "0")}:${mm}`;
}

/* -------- Convert backend status to frontend format -------- */
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

/* -------- Normalize appointment data for frontend use -------- */
export function normalizeAppointment(a) {
  if (!a) return null;

  const id = a._id || a.id || String(Math.random()).slice(2);
  const patient = a.patientName || a.patient || a.name || "Unknown";
  const age = a.age ?? a.patientAge ?? "";
  const gender = a.gender || "";

  const doctorObj =
    a.doctorId && typeof a.doctorId === "object" ? a.doctorId : {};

  const doctorName = doctorObj.name || a.doctorName || a.doctor || "Doctor";

  const doctorImage =
    doctorObj.imageUrl ||
    doctorObj.image ||
    a.doctorImage ||
    a.doctorImageUrl ||
    NoPersonImage;

  const speciality =
    doctorObj.specialization ||
    doctorObj.speciality ||
    a.speciality ||
    a.specialization ||
    "-";

  const mobile = a.mobile || a.phone || "-";
  const fee = Number(a.fees ?? a.fee ?? a.payment?.amount ?? 0) || 0;
  const date = a.date || a.slot?.date || "-";

  const rawTime =
    a.time ||
    a.slot?.time ||
    (a.hour != null
      ? `${String(a.hour).padStart(2, "0")}:${String(a.minute || 0).padStart(2, "0")}`
      : "-");

  const time = to24Hour(rawTime);

  const status = backendToFrontendStatus(
    a.status || a.payment?.status || "Pending",
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

/* -------- Get appointments array from API response safely -------- */
export function getAppointmentsArray(data) {
  if (Array.isArray(data?.appointments)) return data.appointments;
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data)
      ? data.data
      : [];
}

/* -------- Normalize appointments from API response -------- */
export function normalizeAppointmentsFromResponse(data) {
  return getAppointmentsArray(data).map(normalizeAppointment).filter(Boolean);
}
