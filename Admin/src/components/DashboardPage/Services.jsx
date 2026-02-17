// MediFlow / Admin / src / components / DashboardPage / Services.jsx

/* -------- Convert a value to a number, use fallback if not a valid number -------- */
export const safeNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/* -------- Standardize doctor object with id, name, specialization, fee, image, appointments, earnings
 -------- */
export function normalizeDoctor(doc) {
  const id = doc._id || doc.id || String(Math.random()).slice(2);
  const name =
    doc.name ||
    doc.fullName ||
    `${doc.firstName || ""} ${doc.lastName || ""}`.trim() ||
    "Unknown";
  const specialization =
    doc.specialization ||
    doc.speciality ||
    (Array.isArray(doc.specializations)
      ? doc.specializations.join(", ")
      : "") ||
    "General";
  const fee = safeNumber(
    doc.fee ?? doc.fees ?? doc.consultationFee ?? doc.consultation_fee ?? 0,
    0,
  );
  const image =
    doc.imageUrl ||
    doc.image ||
    doc.avatar ||
    `https://i.pravatar.cc/150?u=${id}`;

  const appointments = {
    total:
      doc.appointments?.total ??
      doc.totalAppointments ??
      doc.appointmentsTotal ??
      0,
    completed:
      doc.appointments?.completed ??
      doc.completedAppointments ??
      doc.appointmentsCompleted ??
      0,
    canceled:
      doc.appointments?.canceled ??
      doc.canceledAppointments ??
      doc.appointmentsCanceled ??
      0,
  };

  let earnings = null;
  if (doc.earnings !== undefined && doc.earnings !== null)
    earnings = safeNumber(doc.earnings, 0);
  else if (doc.revenue !== undefined && doc.revenue !== null)
    earnings = safeNumber(doc.revenue, 0);
  else if (appointments.completed && fee)
    earnings = fee * safeNumber(appointments.completed, 0);
  else earnings = 0;

  return {
    id,
    name,
    specialization,
    fee,
    image,
    appointments,
    earnings,
    raw: doc,
  };
}

/* -------- Filter doctors by name or specialization matching query -------- */
export function filterDoctors(doctors, query) {
  if (!query) return doctors;

  const q = query.toLowerCase();

  return doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      (d.specialization || "").toLowerCase().includes(q),
  );
}

/* -------- Calculate totals for doctors: total, appointments, earnings, completed, canceled, login patients -------- */
export function calculateTotals(doctors) {
  const totalDoctors = doctors.length;

  const totalAppointments = doctors.reduce(
    (s, d) => s + safeNumber(d.appointments?.total, 0),
    0,
  );

  const totalEarnings = doctors.reduce(
    (s, d) => s + safeNumber(d.earnings, 0),
    0,
  );

  const completed = doctors.reduce(
    (s, d) => s + safeNumber(d.appointments?.completed, 0),
    0,
  );

  const canceled = doctors.reduce(
    (s, d) => s + safeNumber(d.appointments?.canceled, 0),
    0,
  );

  const totalLoginPatients =
    doctors.reduce((s, d) => s + (d.raw?.loginPatientsCount ?? 0), 0) || 0;

  return {
    totalDoctors,
    totalAppointments,
    totalEarnings,
    completed,
    canceled,
    totalLoginPatients,
  };
}
