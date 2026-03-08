/* -------- Convert date input to ISO string "YYYY-MM-DD" -------- */
export function normalizeToDateString(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toISOString().split("T")[0];
}

/* -------- Build a schedule map where keys are dates and values are times -------- */
export function buildScheduleMap(schedule) {
  const map = {};
  if (!schedule || typeof schedule !== "object") return map;
  Object.entries(schedule).forEach(([k, v]) => {
    const nd = normalizeToDateString(k) || String(k);
    map[nd] = Array.isArray(v) ? v.slice() : [];
  });
  return map;
}

/* -------- Get sorted dates from schedule (past first, future later) -------- */
export function getSortedScheduleDates(scheduleLike) {
  let keys = [];
  if (Array.isArray(scheduleLike)) {
    keys = scheduleLike.map(normalizeToDateString).filter(Boolean);
  } else if (scheduleLike && typeof scheduleLike === "object") {
    keys = Object.keys(scheduleLike).map(normalizeToDateString).filter(Boolean);
  }

  keys = Array.from(new Set(keys));
  const parsed = keys.map((ds) => ({ ds, date: new Date(ds) }));
  const dateVal = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

  const today = new Date();
  const todayVal = dateVal(today);

  const past = parsed
    .filter((p) => dateVal(p.date) < todayVal)
    .sort((a, b) => dateVal(b.date) - dateVal(a.date));

  const future = parsed
    .filter((p) => dateVal(p.date) >= todayVal)
    .sort((a, b) => dateVal(a.date) - dateVal(b.date));

  return [...past, ...future].map((p) => p.ds);
}

/* --------  Extract doctors array from API response -------- */
export function normalizeDoctorsResponse(body) {
  const list = Array.isArray(body?.data)
    ? body.data
    : Array.isArray(body?.doctors)
      ? body.doctors
      : [];

  return list;
}

/* -------- Normalize doctors and ensure schedule is a proper map -------- */
export function normalizeDoctors(list, buildScheduleMap) {
  return (Array.isArray(list) ? list : []).map((d) => ({
    ...d,
    schedule: buildScheduleMap(d.schedule || {}),
  }));
}

/* -------- Filter doctors by search query and availability status -------- */
export function filterDoctorsList(doctors, query, filterStatus) {
  const q = (query || "").trim().toLowerCase();
  let list = doctors;

  if (filterStatus === "available") {
    list = list.filter(
      (d) => (d.availability || "").toLowerCase() === "available",
    );
  } else if (filterStatus === "unavailable") {
    list = list.filter(
      (d) => (d.availability || "").toLowerCase() !== "available",
    );
  }

  if (!q) return list;

  return list.filter((d) => {
    return (
      (d.name || "").toLowerCase().includes(q) ||
      (d.specialization || "").toLowerCase().includes(q)
    );
  });
}
