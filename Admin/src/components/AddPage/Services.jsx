// MediFlow / Admin / src / components / AddPage / Services.jsx

/* --------  Convert "HH:MM AM/PM" to minutes -------- */
export function timeStringToMinutes(t) {
  if (!t) return 0;
  const [hhmm, ampm] = t.split(" ");
  let [h, m] = hhmm.split(":").map(Number);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

/* -------- Format "YYYY-MM-DD" to "D Mon YYYY" -------- */
export function formatDateISO(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
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

/* -------- Turn schedule object {date: [times]} into flat array [{date, time}] -------- */
export function getFlatSlots(s) {
  const arr = [];
  Object.keys(s || {})
    .sort()
    .forEach((d) => {
      (s[d] || []).forEach((t) => arr.push({ date: d, time: t }));
    });
  return arr;
}

/* -------- Return hours 1–12 as {value, label} -------- */
export function getHourOptions() {
  return Array.from({ length: 12 }).map((_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));
}

/* -------- Return minutes 00–59 as {value, label} -------- */
export function getMinuteOptions() {
  return Array.from({ length: 60 }).map((_, i) => {
    const v = String(i).padStart(2, "0");
    return { value: v, label: v };
  });
}
