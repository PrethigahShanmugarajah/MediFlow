/* -------- Get the currency symbol or code from environment variables -------- */
export const CURRENCY = import.meta.env.VITE_CURRENCY;

/* -------- Initial number of items shown in dashboards -------- */
export const INITIAL_DASHBOARD_ITEMS = 8;

/* -------- Return today's date in YYYY-MM-DD format -------- */
export function getTodayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* -------- Options for availability dropdown -------- */
export const availabilityOptions = [
  { value: "Available", label: "Available" },
  { value: "Unavailable", label: "Unavailable" },
];

/* -------- Generate hours 01–12 for time selection -------- */
export const hourOptions = Array.from({ length: 12 }, (_, i) => {
  const h = String(i + 1).padStart(2, "0");
  return {
    value: h,
    label: h,
  };
});

/* -------- Returns minute options with given step -------- */
export const minuteOptions = Array.from({ length: 12 }, (_, i) => {
  const value = String(i * 5).padStart(2, "0");
  return { value, label: value };
});

/* -------- Shared AM/PM options -------- */
export const ampmOptions = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

/* -------- List of month abbreviations -------- */
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/* -------- Format ISO date (YYYY-MM-DD) to "DD Mon YYYY" -------- */
export function formatDateISO(iso) {
  if (!iso || typeof iso !== "string") return iso;

  try {
    const d = new Date(iso + "T00:00:00");

    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/* -------- Capitalize each word -------- */
export function capitalizeWords(text) {
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

/* -------- Format paragraph text professionally -------- */
export function formatParagraph(text) {
  if (!text || typeof text !== "string") return "";

  const result = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const lower = s.toLowerCase();
      const formatted = lower.charAt(0).toUpperCase() + lower.slice(1);

      return /[.!?]$/.test(formatted) ? formatted : formatted + ".";
    })
    .join(" ");

  return result;
}
