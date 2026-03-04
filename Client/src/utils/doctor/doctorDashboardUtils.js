// MediFlow / Client / src / utils / doctor / doctorDashboardUtils.js

/* -------- Create Date object from date and time -------- */
export function parseDateTime(date, time) {
  return new Date(`${date}T${time}:00`);
}

/* -------- Convert 24-hour time to 12-hour AM/PM format -------- */
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

/* -------- Convert backend status to frontend format -------- */
export function backendToFrontendStatus(s) {
  if (!s) return "pending";
  const v = String(s).toLowerCase();
  if (v === "pending") return "pending";
  if (v === "confirmed") return "confirmed";
  if (v === "completed") return "complete";
  if (v === "canceled" || v === "cancelled") return "cancelled";
  if (v === "rescheduled") return "rescheduled";
  return v;
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

/* -------- Convert 12-hour time to 24-hour format -------- */
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

/* -------- Convert 24-hour time to 12-hour format -------- */
export function to12HourFrom24(hhmm) {
  if (!hhmm) return "12:00 AM";
  const [hh, mm] = hhmm.split(":").map(Number);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${String(h12)}:${String(mm).padStart(2, "0")} ${ampm}`;
}

/* -------- Normalize appointment data for frontend use -------- */
export function normalizeAppointment(a) {
  if (!a) return null;
  const id = a._id || a.id || String(Math.random()).slice(2);
  const patient = a.patientName || a.patient || a.name || "Unknown";
  const age = a.age ?? a.patientAge ?? "";
  const gender = a.gender || "";
  const doctorName =
    (a.doctorId && typeof a.doctorId === "object" && a.doctorId.name) ||
    a.doctorName ||
    a.doctor ||
    "Doctor";

  const doctorImage =
    (a.doctorId && typeof a.doctorId === "object" && a.doctorId.imageUrl) ||
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
    (a.hour != null && a.minute != null
      ? `${String(a.hour).padStart(2, "0")}:${String(a.minute).padStart(
          2,
          "0",
        )}`
      : "");
  const time24 = to24Hour(rawTime);
  const status = backendToFrontendStatus(
    a.status || (a.payment && a.payment.status) || "Pending",
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
    time: time24,
    fee,
    status,
    raw: a,
  };
}

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
  const list = Array.isArray(data?.appointments)
    ? data.appointments
    : Array.isArray(data)
      ? data
      : (data?.items ?? data?.data ?? []);

  return (Array.isArray(list) ? list : [])
    .map(normalizeAppointment)
    .filter(Boolean);
}

/* -------- Merge Updated Appointment Data -------- */
export function mergeUpdatedAppointment(prev, id, updated, backendStatus) {
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
