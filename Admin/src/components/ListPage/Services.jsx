// MediFlow / Admin / src / components / ListPage / Services.jsx

/* -------- Converts "YYYY-MM-DD" to "DD Mon YYYY" format -------- */
export function formatDateISO(iso) {
  if (!iso || typeof iso !== "string") return iso;
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const [y, m, d] = parts;
  const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(Number(d));
  const month = monthNames[dateObj.getMonth()] || "";
  return `${day} ${month} ${y}`;
}

/* -------- Converts any date input to ISO "YYYY-MM-DD" string -------- */
export function normalizeToDateString(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toISOString().split("T")[0];
}

/* -------- Makes a safe copy of schedule object with dates as keys and slots as arrays -------- */
export function buildScheduleMap(schedule) {
  const map = {};
  if (!schedule || typeof schedule !== "object") return map;
  Object.entries(schedule).forEach(([k, v]) => {
    const nd = normalizeToDateString(k) || String(k);
    map[nd] = Array.isArray(v) ? v.slice() : [];
  });
  return map;
}

/* -------- Returns all schedule dates sorted: past dates first (descending), future dates next (ascending) -------- */
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

/* -------- Filters doctors list by search query and availability status -------- */
export function filterDoctors(doctors, query, filterStatus) {
  const q = query.trim().toLowerCase();
  let list = doctors;

  if (filterStatus === "available") {
    list = list.filter(
      (d) => (d.availability || "").toString().toLowerCase() === "available",
    );
  } else if (filterStatus === "unavailable") {
    list = list.filter(
      (d) => (d.availability || "").toString().toLowerCase() !== "available",
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

/* -------- Normalizes a list of doctors so each has a proper schedule map -------- */
export function normalizeDoctors(list = []) {
  return list.map((d) => ({
    ...d,
    schedule: buildScheduleMap(d.schedule || {}),
  }));
}
