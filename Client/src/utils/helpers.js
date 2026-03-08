/* -------- Get the currency symbol -------- */
export const CURRENCY = import.meta.env.VITE_CURRENCY;

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

  const words = name.split(" ");

  const formatted = words
    .map((w) => {
      if (!w) return ""; // keep spaces while typing
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");

  if (/^prof\s+dr/i.test(formatted)) {
    return formatted;
  }

  if (/^dr/i.test(formatted)) {
    const withoutDr = formatted.replace(/^dr\.?\s*/i, "");
    return `Dr. ${withoutDr}`;
  }

  return `Dr. ${formatted}`;
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
