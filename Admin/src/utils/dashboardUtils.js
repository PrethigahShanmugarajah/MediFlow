// MediFlow / Admin / src / utils / dashboardUtils.js

/* -------- Safely convert a value to a number, fallback to default if invalid -------- */
export const safeNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/* -------- Normalize a doctor object into a standard format -------- */
export const normalizeDoctor = (doc) => {
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
};

/* -------- Compute total counts and sums for dashboard stats -------- */
export const computeDashboardTotals = (doctors = []) => {
  const totalDoctors = doctors.length;

  const totalAppointments = doctors.reduce(
    (sum, d) => sum + safeNumber(d.appointments?.total, 0),
    0,
  );

  const totalEarnings = doctors.reduce(
    (sum, d) => sum + safeNumber(d.earnings, 0),
    0,
  );

  const completed = doctors.reduce(
    (sum, d) => sum + safeNumber(d.appointments?.completed, 0),
    0,
  );

  const canceled = doctors.reduce(
    (sum, d) => sum + safeNumber(d.appointments?.canceled, 0),
    0,
  );

  const totalLoginPatients =
    doctors.reduce((sum, d) => sum + (d.raw?.loginPatientsCount ?? 0), 0) || 0;

  return {
    totalDoctors,
    totalAppointments,
    totalEarnings,
    completed,
    canceled,
    totalLoginPatients,
  };
};

/* -------- Filter doctors based on search query -------- */
export const filterDoctors = (doctors = [], query = "") => {
  if (!query) return doctors;

  const q = query.trim().toLowerCase();
  const qNum = Number(q);

  return doctors.filter((d) => {
    if ((d.name || "").toLowerCase().includes(q)) return true;
    if ((d.specialization || "").toLowerCase().includes(q)) return true;

    const feeStr = String(d.fee ?? "");
    if (feeStr.includes(q)) return true;

    if (!Number.isNaN(qNum) && safeNumber(d.fee, 0) <= qNum) return true;

    return false;
  });
};

/* -------- Number of doctors to show initially in the dashboard -------- */
export const INITIAL_COUNT = 8;
