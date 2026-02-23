// MediFlow / Admin / src / utils / serviceDashboardUtils.js

/* -------- Convert a raw service object into a clean, consistent format -------- */
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

/* -------- Get an array of items from different possible response shapes -------- */
export function extractArrayFromResponse(body) {
  if (!body) return [];

  if (Array.isArray(body)) return body;
  if (Array.isArray(body.services)) return body.services;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.items)) return body.items;

  const maybeArray = Object.values(body).find((v) => Array.isArray(v));
  return maybeArray || [];
}

/* -------- Filter services by name or price based on search query
 -------- */
export function filterServices(services, searchQuery) {
  const q = (searchQuery || "").trim().toLowerCase();
  if (!q) return services;

  const qNum = Number(q);

  return services.filter((s) => {
    const name = (s?.name || "").toLowerCase();
    const price = Number(s?.price || 0);

    if (name.includes(q)) return true;
    if (!Number.isNaN(qNum) && price <= qNum) return true;
    if (String(price).includes(q)) return true;

    return false;
  });
}

/* -------- Calculate totals for a list of services (appointments, completed, canceled, earnings) -------- */
export function computeServiceTotals(services) {
  return services.reduce(
    (acc, s) => {
      const totalAppointments = Number(s?.totalAppointments || 0);
      const completed = Number(s?.completed || 0);
      const canceled = Number(s?.canceled || 0);
      const price = Number(s?.price || 0);

      acc.totalServices += 1;
      acc.totalAppointments += totalAppointments;
      acc.totalCompleted += completed;
      acc.totalCanceled += canceled;
      acc.totalEarning += completed * price;

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

/* -------- Format a number as LKR currency -------- */
export function formatLKR(v) {
  return `LKR${Number(v || 0).toLocaleString()}`;
}

/* -------- Take a response body and normalize all services -------- */
export function buildNormalizedServicesFromResponse(body) {
  const list = extractArrayFromResponse(body);
  return (list || []).map(normalizeService).filter(Boolean);
}
