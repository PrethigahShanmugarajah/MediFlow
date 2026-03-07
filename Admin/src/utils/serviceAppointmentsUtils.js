// MediFlow / Admin / src / utils / serviceAppointmentsUtils.js

/* -------- Pad number to two digits -------- */
export function formatTwo(n) {
  return String(n).padStart(2, "0");
}

/* -------- Format date nicely -------- */
export function formatDateNice(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* -------- Parse "HH:MM AM/PM" into parts -------- */
export function parseTimeToParts(timeStr) {
  if (!timeStr) return { hour: 12, minute: 0, ampm: "AM" };
  const m = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (m) {
    let hh = Number(m[1]);
    const mm = Number(m[2]);
    const ampm = m[3] ? m[3].toUpperCase() : null;
    if (!ampm) {
      const hour12 = hh % 12 === 0 ? 12 : hh % 12;
      return { hour: hour12, minute: mm, ampm: hh >= 12 ? "PM" : "AM" };
    }
    return { hour: hh, minute: mm, ampm };
  }
  return { hour: 12, minute: 0, ampm: "AM" };
}

/* -------- Convert 24h hour + minute to "hh:mm AM/PM" string -------- */
export function timePartsTo12HourString(hh24, mm) {
  let ampm = hh24 >= 12 ? "PM" : "AM";
  let hour = hh24 % 12 === 0 ? 12 : hh24 % 12;
  return `${formatTwo(hour)}:${formatTwo(mm)} ${ampm}`;
}

/* -------- Convert time parts object to input value "HH:MM" -------- */
export function timePartsToInputValue(a) {
  const hour = Number(a.hour || 0);
  const minute = Number(a.minute || 0);
  let hh24 = hour % 12;
  if ((a.ampm || "AM").toUpperCase() === "PM") hh24 += 12;
  if (a.ampm === "AM" && hour === 12) hh24 = 0;
  if (a.ampm === "PM" && hour === 12) hh24 = 12;
  return `${formatTwo(hh24)}:${formatTwo(minute)}`;
}

/* -------- Format time for display -------- */
export function formatTimeDisplay(a) {
  return `${formatTwo(a.hour)}:${formatTwo(a.minute)} ${a.ampm}`;
}

/* -------- Get today's date in YYYY-MM-DD -------- */
export function getTodayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* -------- Check if date A is before date B -------- */
export function isDateBefore(aDateStr, bDateStr) {
  try {
    const a = new Date(`${aDateStr}T00:00:00`);
    const b = new Date(`${bDateStr}T00:00:00`);
    return a.getTime() < b.getTime();
  } catch {
    return false;
  }
}

/* -------- Extract list from backend safely -------- */
export function extractAppointmentsList(body) {
  if (!body) return [];
  const list = Array.isArray(body.appointments)
    ? body.appointments
    : (body.appointments ?? body.items ?? body.data ?? []);
  return Array.isArray(list) ? list : [];
}

/* -------- Extract updated appointment from API response -------- */
export function extractUpdatedAppointment(body) {
  return body?.data || body?.appointment || body || {};
}

/* -------- Timestamp for sorting (latest first) -------- */
export function getAppointmentTimestamp(a) {
  try {
    const [y, m, d] = (a?.date || "1970-01-01").split("-").map(Number);

    let hour = Number(a?.hour) || 0;
    const ampm = String(a?.ampm || "AM").toUpperCase();

    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    const minute = Number(a?.minute) || 0;

    return new Date(y, (m || 1) - 1, d || 1, hour, minute).getTime();
  } catch {
    return 0;
  }
}

/* -------- Status lock checker -------- */
export function isStatusLocked(status) {
  const s = String(status || "").toLowerCase();
  return s === "completed" || s === "canceled";
}

/* -------- Build time string with safe fallbacks -------- */
export function buildAppointmentTimeString(a) {
  return (
    a?.time ||
    a?.slot?.time ||
    a?.rescheduledTo?.time ||
    (a?.hour !== undefined && a?.minute !== undefined
      ? `${formatTwo(a.hour || 12)}:${formatTwo(a.minute ?? 0)} ${a.ampm || "AM"}`
      : "") ||
    ""
  );
}

/* -------- Normalize ONE appointment object -------- */
export function normalizeAppointment(a) {
  const timeStr = buildAppointmentTimeString(a);
  const parsed = parseTimeToParts(timeStr);

  return {
    id: a?._id || a?.id,
    patientName: a?.patientName || a?.name || a?.raw?.patientName || "Unknown",
    gender: a?.gender || a?.raw?.gender || "",
    mobile: a?.mobile || a?.phone || "",
    age: a?.age || a?.raw?.age || "",
    serviceName:
      a?.serviceName ||
      a?.service ||
      a?.raw?.serviceName ||
      (a?.notes || "").slice(0, 40),
    fees: a?.fees ?? a?.fee ?? a?.payment?.amount ?? 0,
    date: a?.date || a?.slot?.date || a?.rescheduledTo?.date || "",
    hour: parsed.hour,
    minute: parsed.minute,
    ampm: parsed.ampm,
    status: a?.status || a?.payment?.status || "Pending",
    raw: a,
  };
}

/* -------- Normalize MANY appointments -------- */
export function normalizeAppointments(list) {
  return (Array.isArray(list) ? list : [])
    .map(normalizeAppointment)
    .filter(Boolean);
}

/* -------- Apply updated response fields onto current appointment -------- */
export function applyUpdatedAppointmentFields(
  current,
  updated,
  fallbackStatus,
) {
  const date = updated?.date || updated?.rescheduledTo?.date || current.date;

  const timeStr =
    updated?.time ||
    updated?.rescheduledTo?.time ||
    current?.raw?.time ||
    `${formatTwo(current.hour)}:${formatTwo(current.minute)} ${current.ampm}`;

  const parsed = parseTimeToParts(timeStr);

  return {
    ...current,
    status: updated?.status || fallbackStatus || current.status,
    date,
    hour: parsed.hour,
    minute: parsed.minute,
    ampm: parsed.ampm,
    raw: updated || current.raw,
  };
}

/* -------- Convert "HH:MM" input value to "hh:mm AM/PM" -------- */
export function time24To12HourString(time24) {
  const [hh, mm] = String(time24 || "00:00")
    .split(":")
    .map(Number);
  return timePartsTo12HourString(hh || 0, mm || 0);
}

/* -------- Filter appointments by query + status -------- */
export function filterAppointments(list, query, statusFilter) {
  const q = String(query || "")
    .trim()
    .toLowerCase();

  return (Array.isArray(list) ? list : [])
    .filter((a) =>
      q
        ? String(a?.patientName || "")
            .toLowerCase()
            .includes(q) ||
          String(a?.serviceName || "")
            .toLowerCase()
            .includes(q)
        : true,
    )
    .filter((a) => (statusFilter ? a?.status === statusFilter : true));
}

/* -------- Convert time24 to { timeStr, hour, minute, ampm } -------- */
export function time24ToParts(time24) {
  const timeStr = time24To12HourString(time24);
  const parsed = parseTimeToParts(timeStr);
  return { timeStr, ...parsed };
}

/* -------- Apply updated response fields for RESCHEDULE (date + time + status) -------- */
export function applyRescheduleResult(
  current,
  updated,
  fallbackDate,
  fallbackTimeStr,
) {
  const finalDate =
    updated?.date ||
    updated?.rescheduledTo?.date ||
    fallbackDate ||
    current.date;

  const finalTimeStr =
    updated?.time ||
    updated?.rescheduledTo?.time ||
    fallbackTimeStr ||
    buildAppointmentTimeString(current.raw) ||
    `${formatTwo(current.hour)}:${formatTwo(current.minute)} ${current.ampm}`;

  const parsed = parseTimeToParts(finalTimeStr);

  return {
    ...current,
    date: finalDate,
    hour: parsed.hour,
    minute: parsed.minute,
    ampm: parsed.ampm,
    status: updated?.status || "Rescheduled",
    raw: updated || current.raw,
  };
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
