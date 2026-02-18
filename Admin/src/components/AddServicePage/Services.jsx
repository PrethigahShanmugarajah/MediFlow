// MediFlow / Admin / src / components / AddServicePage /Services.jsx

/* -------- Month short names for dropdowns -------- */
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

/* -------- Get current date and time as default slot values -------- */
export function getDefaultSlotValues() {
  const now = new Date();

  const currentDay = String(now.getDate());
  const currentMonth = String(now.getMonth());
  const currentYear = String(now.getFullYear());

  let hour24 = now.getHours();
  let mins = now.getMinutes();

  let rounded = Math.ceil(mins / 5) * 5;

  if (rounded === 60) {
    rounded = 0;
    hour24 += 1;
  }

  const slotMinute = String(rounded).padStart(2, "0");
  const slotAmPm = hour24 >= 12 ? "PM" : "AM";

  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;

  const slotHour = String(hour12).padStart(2, "0");

  return {
    slotDay: currentDay,
    slotMonth: currentMonth,
    slotYear: currentYear,
    slotHour,
    slotMinute,
    slotAmPm,
  };
}

/* -------- Get how many days are in a given month -------- */
export function getDaysInMonth(year, monthIndex) {
  return new Date(Number(year), Number(monthIndex) + 1, 0).getDate();
}

/* -------- Build day dropdown options and disable past days -------- */
export function buildDayOptions({
  slotYear,
  slotMonth,
  currentYear,
  currentMonth,
  currentDay,
}) {
  const daysInSelectedMonth = getDaysInMonth(slotYear, slotMonth);

  const days = Array.from({ length: daysInSelectedMonth }, (_, i) =>
    String(i + 1),
  );

  return days.map((d) => {
    const dNum = Number(d);

    const disabled =
      Number(slotYear) === Number(currentYear) &&
      Number(slotMonth) === Number(currentMonth) &&
      dNum < Number(currentDay);

    return { value: d, label: d, isDisabled: disabled };
  });
}

/* -------- Build month dropdown options and disable past months -------- */
export function buildMonthOptions({
  months = MONTHS,
  slotYear,
  currentYear,
  currentMonth,
}) {
  return months.map((m, idx) => {
    const disabled =
      Number(slotYear) === Number(currentYear) && idx < Number(currentMonth);

    return { value: String(idx), label: m, isDisabled: disabled };
  });
}

/* -------- Build year dropdown options starting from base year -------- */
export function buildYearOptions({ baseYear, count = 5 }) {
  const years = Array.from({ length: count }, (_, i) => Number(baseYear) + i);
  return years.map((y) => ({ value: String(y), label: String(y) }));
}

/* -------- Build hour dropdown options (01–12) -------- */
export function buildHourOptions() {
  return Array.from({ length: 12 }, (_, i) => {
    const h = String(i + 1).padStart(2, "0");
    return { value: h, label: h };
  });
}

/* -------- Build minute dropdown options (based on step, default 5 mins) -------- */
export function buildMinuteOptions(step = 5) {
  const count = Math.floor(60 / step);
  return Array.from({ length: count }, (_, i) => {
    const m = String(i * step).padStart(2, "0");
    return { value: m, label: m };
  });
}

/* -------- Build AM/PM dropdown options -------- */
export function buildAmPmOptions() {
  return ["AM", "PM"].map((a) => ({ value: a, label: a }));
}

/* -------- Convert selected slot values into a JavaScript Date object -------- */
export function selectedDateTime({
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
  let h = Number(slotHour);
  const mm = Number(slotMinute);
  const ap = slotAmPm;

  if (ap === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h = h + 12;
  }

  return new Date(y, m, d, h, mm, 0, 0);
}

/* -------- Check if selected date/time is in the past -------- */
export function isSelectedDateTimeInPast(slotValues, nowMs = Date.now()) {
  const sel = selectedDateTime(slotValues);
  return sel.getTime() <= nowMs;
}

/* -------- Format slot values into a readable label (e.g. 12 Jan 2025 • 10:30 AM) -------- */
export function formatSlotLabel(slotValues, months = MONTHS) {
  const m = months[Number(slotValues.slotMonth)];
  const d = String(slotValues.slotDay).padStart(2, "0");
  const y = slotValues.slotYear;
  const h = String(slotValues.slotHour).padStart(2, "0");
  const mm = slotValues.slotMinute;
  const ap = slotValues.slotAmPm;
  return `${d} ${m} ${y} • ${h}:${mm} ${ap}`;
}

/* -------- Try to add a slot (prevent duplicate and past slots) -------- */
export function tryAddSlot({ slots, slotValues, months = MONTHS }) {
  const label = formatSlotLabel(slotValues, months);

  if (slots.includes(label)) {
    return { ok: false, error: "DUPLICATE", slots, label };
  }

  if (isSelectedDateTimeInPast(slotValues)) {
    return { ok: false, error: "PAST", slots, label };
  }

  return { ok: true, error: null, slots: [...slots, label], label };
}

/* -------- Validate Add Service form fields -------- */
export function validateServiceForm({
  selectedFile,
  hasExistingImage,
  serviceName,
  about,
  price,
  instructionValues = [],
  slots = [],
}) {
  const errors = {};

  if (!selectedFile && !hasExistingImage) errors.image = true;
  if (!String(serviceName || "").trim()) errors.serviceName = true;
  if (!String(about || "").trim()) errors.about = true;
  if (!String(price || "").trim()) errors.price = true;

  const hasInstruction = instructionValues.some((v) => String(v || "").trim());
  if (!hasInstruction) errors.instructions = true;

  if (!slots.length) errors.slots = true;

  return { isValid: Object.keys(errors).length === 0, errors };
}
