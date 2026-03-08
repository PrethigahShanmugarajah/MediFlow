/* -------- Capitalize each word -------- */
export function capitalizeWords(text) {
  if (!text || typeof text !== "string") return "";

  return text
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
