// MediFlow / Admin / src / components / ServiceDashboardPage / Services.jsx

/* -------- Normalize a single service object to a standard structure -------- */
export function normalizeService(doc) {
  if (!doc) return null;
  const id = doc._id || doc.id || String(Math.random()).slice(2);
  const name = doc.name || doc.title || doc.serviceName || "Untitled Service";
  const price =
    Number(doc.price ?? doc.fee ?? doc.fees ?? doc.cost ?? doc.amount) || 0;
  const image =
    doc.imageUrl ||
    doc.image ||
    doc.avatar ||
    `https://i.pravatar.cc/150?u=${id}`;

  const totalAppointments =
    doc.totalAppointments ??
    doc.appointments?.total ??
    doc.count ??
    doc.stats?.total ??
    doc.bookings ??
    0;

  const completed =
    doc.completed ??
    doc.appointments?.completed ??
    doc.stats?.completed ??
    doc.completedAppointments ??
    0;

  const canceled =
    doc.canceled ??
    doc.appointments?.canceled ??
    doc.stats?.canceled ??
    doc.canceledAppointments ??
    0;

  return {
    id,
    name,
    price,
    image,
    totalAppointments: Number(totalAppointments) || 0,
    completed: Number(completed) || 0,
    canceled: Number(canceled) || 0,
    raw: doc,
  };
}

/* -------- Extract an array of services from different possible shapes of API response -------- */
export function extractServicesList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.services)) return data.services;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.items)) return data.items;
  const maybeArray = Object.values(data).find((v) => Array.isArray(v));
  return maybeArray || [];
}

/* -------- Normalize a list of services using the normalizeService function -------- */
export function normalizeServicesList(list = [], normalizeFn) {
  return (list || []).map(normalizeFn).filter(Boolean);
}

/* -------- Default number of services to show initially -------- */
export const INITIAL_COUNT = 8;

/* -------- How often to poll for updates (in milliseconds) -------- */
export const POLL_MS = 10000;

/* -------- Filter services based on search query (by name or price) -------- */
export function filterServices(services = [], searchQuery = "") {
  const q = String(searchQuery || "")
    .trim()
    .toLowerCase();
  if (!q) return services;

  const qNum = Number(q);

  return services.filter((s) => {
    if (
      String(s.name || "")
        .toLowerCase()
        .includes(q)
    )
      return true;
    if (!Number.isNaN(qNum) && Number(s.price || 0) <= qNum) return true;
    if (String(s.price ?? "").includes(q)) return true;

    return false;
  });
}

/* -------- Return only the visible services, or all if `showAll` is true -------- */
export function getVisibleServices(
  filteredServices = [],
  showAll = false,
  initial = INITIAL_COUNT,
) {
  return showAll ? filteredServices : filteredServices.slice(0, initial);
}

/* -------- Calculate totals like total appointments, completed, canceled, and earnings -------- */
export function calculateTotals(filteredServices = []) {
  return filteredServices.reduce(
    (acc, s) => {
      acc.totalServices += 1;
      acc.totalAppointments += Number(s.totalAppointments || 0);
      acc.totalCompleted += Number(s.completed || 0);
      acc.totalCanceled += Number(s.canceled || 0);
      acc.totalEarning += Number(s.completed || 0) * Number(s.price || 0);
      return acc;
    },
    {
      totalServices: 0,
      totalAppointments: 0,
      totalCompleted: 0,
      totalCanceled: 0,
      totalEarning: 0,
    },
  );
}

/* -------- Format a number as Sri Lankan Rupees -------- */
export function formatCurrencyLKR(v) {
  return `LKR ${Number(v || 0).toLocaleString()}`;
}
