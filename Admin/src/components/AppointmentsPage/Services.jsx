// MediFlow / Admin / src / components / AppointmentsPage / Services.jsx

/* -------- Format ISO date string to "DD MMM YYYY" -------- */
export function formatDateISO(iso) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return iso;
  }
}

/* -------- Convert a slot object {date, time} into a JS Date object -------- */
export function dateTimeFromSlot(slot) {
  try {
    const [y, m, d] = slot.date.split("-");
    const base = new Date(Number(y), Number(m) - 1, Number(d), 0, 0, 0, 0);

    const [time, ampm] = slot.time.split(" ");
    let [hh, mm] = time.split(":").map(Number);
    if (ampm === "PM" && hh !== 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;
    base.setHours(hh, mm, 0, 0);
    return base;
  } catch (e) {
    return new Date(slot.date + "T00:00:00");
  }
}

/* -------- Normalize raw appointment data into consistent structure -------- */
export function normalizeAppointments(list = []) {
  const arr = Array.isArray(list) ? list : [];
  return arr.map((a) => ({
    id: a._id || a.id,
    patientName: a.patientName || "",
    age: a.age || "",
    gender: a.gender || "",
    mobile: a.mobile || "",
    doctorName: (a.doctorId && a.doctorId.name) || a.doctorName || "",
    speciality:
      (a.doctorId && a.doctorId.specialization) ||
      a.speciality ||
      a.specialization ||
      "General",
    fee: typeof a.fees === "number" ? a.fees : a.fee || 0,
    slot: {
      date: a.date || (a.slot && a.slot.date) || "",
      time: a.time || (a.slot && a.slot.time) || "00:00 AM",
    },
    status: a.status || (a.payment && a.payment.status) || "Pending",
    raw: a,
  }));
}

/* -------- Get a list of unique specialities from appointments -------- */
export function getSpecialities(appointments = []) {
  const set = new Set(
    (appointments || []).map((a) => a.speciality || "General"),
  );
  return ["all", ...Array.from(set)];
}

/* -------- Filter appointments by search query, date, or speciality -------- */
export function filterAppointments(
  appointments = [],
  query = "",
  filterDate = "",
  filterSpeciality = "all",
) {
  const q = String(query).trim().toLowerCase();

  return (appointments || []).filter((a) => {
    if (
      filterSpeciality !== "all" &&
      (a.speciality || "").toLowerCase() !==
        String(filterSpeciality).toLowerCase()
    )
      return false;

    if (filterDate && a.slot?.date !== filterDate) return false;

    if (!q) return true;

    return (
      (a.doctorName || "").toLowerCase().includes(q) ||
      (a.speciality || "").toLowerCase().includes(q) ||
      (a.patientName || "").toLowerCase().includes(q) ||
      (a.mobile || "").toLowerCase().includes(q)
    );
  });
}

/* -------- Sort appointments by slot date/time, newest first -------- */
export function sortAppointmentsBySlotDesc(list = []) {
  return (list || []).slice().sort((a, b) => {
    const da = dateTimeFromSlot(a.slot).getTime();
    const db = dateTimeFromSlot(b.slot).getTime();
    return db - da;
  });
}

/* -------- Check if appointment is locked (cannot be canceled) -------- */
export function isAppointmentLocked(status = "") {
  const s = String(status).toLowerCase();
  return s === "completed" || s === "canceled" || s === "cancelled";
}

/* -------- Load appointments from API and normalize -------- */
export async function loadAppointmentsData(fetchFn, params) {
  const data = await fetchFn(params);
  return normalizeAppointments(data?.appointments);
}

/* -------- Mark an appointment as canceled in local list
 -------- */
export function markAppointmentCanceled(list = [], id) {
  return list.map((p) => (p.id === id ? { ...p, status: "Canceled" } : p));
}
