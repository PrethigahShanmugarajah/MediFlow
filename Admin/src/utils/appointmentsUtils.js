/* -------- Convert a slot object to a Date object -------- */
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
  } catch (error) {
    return new Date(slot.date + "T00:00:00");
  }
}

/* -------- Normalize raw appointments data into consistent structure -------- */
export function normalizeDoctorAppointments(data) {
  return (data?.appointments || []).map((a) => ({
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

/* -------- Filter appointments by search, date, and speciality -------- */
export function filterDoctorAppointments(
  appointments,
  { query = "", filterDate = "", filterSpeciality = "all" } = {},
) {
  const q = (query || "").trim().toLowerCase();

  return (appointments || []).filter((a) => {
    const speciality = (a.speciality || "").toLowerCase();

    if (
      filterSpeciality !== "all" &&
      speciality !== (filterSpeciality || "").toLowerCase()
    ) {
      return false;
    }

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

/* -------- Sort appointments from newest to oldest -------- */
export function sortAppointmentsByNewest(list) {
  return (list || []).slice().sort((a, b) => {
    const da = dateTimeFromSlot(a.slot).getTime();
    const db = dateTimeFromSlot(b.slot).getTime();
    return db - da;
  });
}

/* -------- Get boolean flags for appointment status -------- */
export function getAppointmentStatusFlags(status) {
  const s = String(status || "").toLowerCase();

  const isCancelled = s === "canceled" || s === "cancelled";
  const isCompleted = s === "completed";
  const isDisabled = isCancelled || isCompleted;

  return { isCancelled, isCompleted, isDisabled };
}

/* --------  Update an appointment in the list with new data -------- */
export function applyUpdatedAppointment(list, id, updated) {
  if (!updated) return list;

  return (list || []).map((p) =>
    p.id === id
      ? {
          ...p,
          status: updated.status || "Canceled",
          slot: {
            date: updated.date || p.slot.date,
            time: updated.time || p.slot.time,
          },
          raw: updated,
        }
      : p,
  );
}

/* -------- Check if admin can cancel the appointment -------- */
export function canAdminCancel(status) {
  const s = (status || "").toLowerCase();
  const isCancelled = s === "canceled" || s === "cancelled";
  const isCompleted = s === "completed";
  return !(isCancelled || isCompleted);
}

/* -------- Get CSS classes for appointment status badge -------- */
export function getStatusBadgeClass(status) {
  const s = (status || "").toLowerCase();

  if (s === "confirmed") return "bg-teal-50 text-teal-700 border-teal-100";
  if (s === "completed")
    return "bg-indigo-50 text-indigo-700 border-indigo-100";
  if (s === "rescheduled")
    return "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100";
  if (s === "canceled" || s === "cancelled")
    return "bg-red-50 text-red-700 border-red-100";
  if (s === "pending") return "bg-lime-50 text-lime-700 border-lime-100";

  return "bg-gray-50 text-gray-700 border-gray-100";
}
