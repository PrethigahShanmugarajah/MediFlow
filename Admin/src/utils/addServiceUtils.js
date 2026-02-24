// MediFlow / Admin / src / utils / addServiceUtils.js

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

/* --------  Options for availability dropdown -------- */
export const availabilityOptions = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
];

/* -------- Returns array of years from currentYear -------- */
export function yearOptions(currentYear, count = 10) {
  return Array.from({ length: count }, (_, i) => {
    const y = currentYear + i;
    return { value: String(y), label: String(y) };
  });
}

/* -------- Returns months options and disables past months for current year -------- */
export function monthOptions({ slotYear, currentYear, currentMonth }) {
  return MONTHS.map((m, idx) => ({
    value: String(idx),
    label: m,
    isDisabled: Number(slotYear) === currentYear && idx < currentMonth,
  }));
}

/* -------- Returns day options and disables past days for current month/year -------- */
export function dayOptions({
  days,
  slotYear,
  slotMonth,
  currentYear,
  currentMonth,
  currentDate,
}) {
  return days.map((d) => {
    const dNum = Number(d);

    const disabled =
      Number(slotYear) === currentYear &&
      Number(slotMonth) === currentMonth &&
      dNum < currentDate;

    return {
      value: d,
      label: d,
      isDisabled: disabled,
    };
  });
}

/* -------- Returns 12-hour format hour options (01-12) -------- */
export function hourOptions() {
  return Array.from({ length: 12 }, (_, i) => {
    const h = String(i + 1).padStart(2, "0");
    return { value: h, label: h };
  });
}

/* -------- Returns minute options with given step -------- */
export function minuteOptions(step = 5) {
  const count = 60 / step;
  return Array.from({ length: count }, (_, i) => {
    const m = String(i * step).padStart(2, "0");
    return { value: m, label: m };
  });
}

/* -------- Returns AM/PM options -------- */
export function ampmOptions() {
  return ["AM", "PM"].map((a) => ({
    value: a,
    label: a,
  }));
}

/* -------- Get number of days in a given month -------- */
export function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/* -------- Create array of days as strings -------- */
export function buildDaysArray(daysInMonth) {
  return Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
}

/* -------- Convert 12-hour time to 24-hour number -------- */
export function to24Hour(hour12, ampm) {
  let h = Number(hour12);
  if (ampm === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h = h + 12;
  }
  return h;
}

/* -------- Build a JS Date object from slot selection -------- */
export function buildSelectedDateTime({
  slotDay,
  slotMonth,
  slotYear,
  slotHour,
  slotMinute,
  slotAmPm,
}) {
  const d = Number(slotDay);
  const m = Number(slotMonth);
  const y = Number(slotYear);
  const h24 = to24Hour(slotHour, slotAmPm);
  const mm = Number(slotMinute);

  return new Date(y, m, d, h24, mm, 0, 0);
}

/* -------- Check if a date is in the past -------- */
export function isDateTimeInPast(dateObj) {
  return dateObj.getTime() <= Date.now();
}

/* -------- Format slot into readable label (DD MMM YYYY • HH:MM AM/PM) -------- */
export function formatSlotLabel({
  slotDay,
  slotMonth,
  slotYear,
  slotHour,
  slotMinute,
  slotAmPm,
}) {
  const m = MONTHS[Number(slotMonth)];
  const d = String(slotDay).padStart(2, "0");
  const y = String(slotYear);
  const h = String(slotHour).padStart(2, "0");
  const mm = String(slotMinute).padStart(2, "0");
  const ap = slotAmPm;

  return `${d} ${m} ${y} • ${h}:${mm} ${ap}`;
}

/* -------- Check if a slot is duplicate in slots array -------- */
export function isDuplicateSlot(slots, formattedSlot) {
  return Array.isArray(slots) && slots.includes(formattedSlot);
}

/* -------- Validate service form fields, return errors object -------- */
export function validateServiceForm({
  imageFile,
  hasExistingImage,
  serviceName,
  about,
  price,
  instructions,
  slots,
}) {
  const newErrors = {};

  if (!imageFile && !hasExistingImage) newErrors.image = true;
  if (!String(serviceName || "").trim()) newErrors.serviceName = true;
  if (!String(about || "").trim()) newErrors.about = true;
  if (!String(price || "").trim()) newErrors.price = true;

  const hasAtLeastOneInstruction = Array.isArray(instructions)
    ? instructions.some((ins) => String(ins ?? "").trim())
    : false;

  if (!hasAtLeastOneInstruction) newErrors.instructions = true;
  if (!Array.isArray(slots) || slots.length === 0) newErrors.slots = true;

  return newErrors;
}

/* -------- Normalize API data for service form -------- */
export function normalizeServiceForForm(data) {
  const name = data?.name || "";
  const about = data?.about || data?.description || "";
  const price = data?.price != null ? String(data.price) : "";
  const availability = data?.available ? "available" : "unavailable";

  const instructions =
    Array.isArray(data?.instructions) && data.instructions.length
      ? data.instructions
      : [""];

  const slots = Array.isArray(data?.slots) ? data.slots : [];

  const imageUrl = data?.imageUrl || null;

  return { name, about, price, availability, instructions, slots, imageUrl };
}

/* -------- Remove non-numeric characters from price -------- */
export function sanitizePrice(value) {
  const numeric = String(value ?? "").replace(/[^\d.-]/g, "");
  return numeric === "" ? "0" : numeric;
}

/* -------- Build FormData object from service form -------- */
export function buildServiceFormData({
  serviceName,
  about,
  price,
  availability,
  instructions,
  slots,
  imageFile,
  removeImage,
}) {
  const fd = new FormData();
  fd.append("name", serviceName);
  fd.append("about", about);
  fd.append("price", sanitizePrice(price));
  fd.append("availability", availability);
  fd.append("instructions", JSON.stringify(instructions));
  fd.append("slots", JSON.stringify(slots));

  if (imageFile) fd.append("image", imageFile);
  else if (removeImage) fd.append("removeImage", "true");

  return fd;
}

/* -------- Get initial form state from API data -------- */
export function getServiceFormStateFromApi(data) {
  const normalized = normalizeServiceForForm(data);

  return {
    serviceName: normalized.name,
    about: normalized.about,
    price: normalized.price,
    availability: normalized.availability,
    instructions: normalized.instructions,
    slots: normalized.slots,

    imagePreview: normalized.imageUrl || null,
    hasExistingImage: Boolean(normalized.imageUrl),
    removeImage: false,
  };
}

/* -------- Clamp day to last day of month if overflow -------- */
export function clampDayToMonth(slotDay, daysInSelectedMonth) {
  const dayNum = Number(slotDay);
  if (!Number.isFinite(dayNum)) return String(daysInSelectedMonth);
  return dayNum > daysInSelectedMonth
    ? String(daysInSelectedMonth)
    : String(slotDay);
}

/* -------- Check if a slot can be added (duplicate/past) -------- */
export function getAddSlotResult(slots, slotState) {
  const formatted = formatSlotLabel(slotState);

  if (isDuplicateSlot(slots, formatted)) {
    return { ok: false, reason: "DUPLICATE", formatted };
  }

  const selected = buildSelectedDateTime(slotState);
  if (isDateTimeInPast(selected)) {
    return { ok: false, reason: "PAST", formatted };
  }

  return { ok: true, reason: null, formatted };
}

/* -------- Round up minutes to nearest step -------- */
export function roundUpToStep(minute, step = 5) {
  const r = minute % step;
  return r === 0 ? minute : minute + (step - r);
}

/* -------- Convert 24-hour to 12-hour time -------- */
export function to12Hour(hour24) {
  const ampm = hour24 >= 12 ? "PM" : "AM";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12: String(hour12).padStart(2, "0"), ampm };
}

/* -------- Get current time rounded to step in 12-hour format -------- */
export function getRoundedTimeNow(step = 5) {
  const now = new Date();
  let h = now.getHours();
  let m = roundUpToStep(now.getMinutes(), step);

  if (m === 60) {
    m = 0;
    h = (h + 1) % 24;
  }

  const { hour12, ampm } = to12Hour(h);
  return {
    hour: hour12,
    minute: String(m).padStart(2, "0"),
    ampm,
  };
}
