// MediFlow / Admin / src/ components / ListServicePage / Services.jsx
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

export function getTodayISO(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDateHuman(dateStr, months = MONTHS) {
  if (!dateStr) return "";
  const parts = String(dateStr).split("-");
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const mi = Number(m) - 1;
  const mon = months[mi] || m;
  return `${String(Number(d))} ${mon} ${y}`;
}

export function slotDateTimeToMs(slot) {
  const [y, m, d] = (slot?.date || "").split("-");
  if (!y || !m || !d) return 0;

  let h = Number(String(slot.hour || "12"));
  if (Number.isNaN(h) || h < 1 || h > 12) h = 12;

  let mm = Number(String(slot.minute || "00"));
  if (Number.isNaN(mm) || mm < 0 || mm > 59) mm = 0;

  const ap =
    String(slot.ampm || "AM")
      .trim()
      .toUpperCase() === "PM"
      ? "PM"
      : "AM";

  if (ap === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h = h + 12;
  }

  return new Date(Number(y), Number(m) - 1, Number(d), h, mm, 0, 0).getTime();
}

export function parseFrontendSlotString(date, timeStr) {
  const slot = {
    date: date || "",
    hour: "10",
    minute: "00",
    ampm: "AM",
    raw: timeStr,
  };

  if (!timeStr) return slot;
  const raw = String(timeStr);

  const isoMatch = raw.match(
    /[T\s](\d{2}):(\d{2})(?::\d{2})?(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/,
  );
  if (isoMatch) {
    const hh24 = Number(isoMatch[1]);
    const mm = String(Number(isoMatch[2])).padStart(2, "0");

    if (hh24 === 0) {
      slot.hour = "12";
      slot.ampm = "AM";
    } else if (hh24 === 12) {
      slot.hour = "12";
      slot.ampm = "PM";
    } else if (hh24 > 12) {
      slot.hour = String(hh24 - 12);
      slot.ampm = "PM";
    } else {
      slot.hour = String(hh24);
      slot.ampm = "AM";
    }

    slot.minute = mm;
    return slot;
  }

  const m = raw.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (m) {
    slot.hour = String(Number(m[1]));
    slot.minute = String(m[2]).padStart(2, "0");
    slot.ampm = (m[3] || "AM").toUpperCase();
  }

  return slot;
}

export function convertSlotsMapToArray(slotsMap) {
  try {
    const out = [];
    if (slotsMap instanceof Map) {
      for (const [date, arr] of slotsMap.entries()) {
        (arr || []).forEach((t, idx) => {
          const parsed = parseFrontendSlotString(date, t);
          out.push({ id: `${date}-${idx}`, ...parsed, raw: t });
        });
      }
    } else {
      for (const date of Object.keys(slotsMap || {})) {
        (slotsMap[date] || []).forEach((t, idx) => {
          const parsed = parseFrontendSlotString(date, t);
          out.push({ id: `${date}-${idx}`, ...parsed, raw: t });
        });
      }
    }
    return out;
  } catch {
    return [];
  }
}

export function convertSlotsForUI(slotStrings = [], months = MONTHS) {
  return (slotStrings || []).map((s, idx) => {
    const raw = String(s || "");
    const m = raw.match(
      /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s*•\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i,
    );

    if (m) {
      const day = m[1].padStart(2, "0");
      const monthShort = m[2];
      const year = m[3];
      const hour = String(Number(m[4]));
      const minute = String(m[5]).padStart(2, "0");
      const ampm = (m[6] || "AM").toUpperCase();

      const mi = months.findIndex(
        (mm) => mm.toLowerCase() === monthShort.toLowerCase(),
      );

      const monthNum = mi >= 0 ? String(mi + 1).padStart(2, "0") : "01";
      const date = `${year}-${monthNum}-${day}`;

      return { id: `s-${idx}`, date, hour, minute, ampm, raw };
    }

    const isoMatch = raw.match(
      /^(\d{4}-\d{2}-\d{2})(?:[T\s](\d{2}):(\d{2})(?::\d{2})?(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?)?/,
    );
    if (isoMatch) {
      const datePart = isoMatch[1];
      let hour = "10";
      let minute = "00";
      let ampm = "AM";

      if (isoMatch[2]) {
        const hh = Number(isoMatch[2]);
        const mm = String(Number(isoMatch[3] || "0")).padStart(2, "0");
        minute = mm;

        if (hh === 0) {
          hour = "12";
          ampm = "AM";
        } else if (hh === 12) {
          hour = "12";
          ampm = "PM";
        } else if (hh > 12) {
          hour = String(hh - 12);
          ampm = "PM";
        } else {
          hour = String(hh);
          ampm = "AM";
        }
      }

      return { id: `s-${idx}`, date: datePart, hour, minute, ampm, raw };
    }

    const timeOnly = raw.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeOnly) {
      const hour = String(Number(timeOnly[1]));
      const minute = String(timeOnly[2]).padStart(2, "0");
      const ampm = (timeOnly[3] || "AM").toUpperCase();
      return { id: `s-${idx}`, date: "", hour, minute, ampm, raw };
    }

    return {
      id: `s-${idx}`,
      date: "",
      hour: "10",
      minute: "00",
      ampm: "AM",
      raw,
    };
  });
}

export function sortSlotsForDisplay(slots = []) {
  if (!Array.isArray(slots)) return [];

  const today = new Date();
  const todayVal = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const dateOnlyVal = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string")
      return Number.POSITIVE_INFINITY;
    const parts = dateStr.split("-");
    if (parts.length !== 3) return Number.POSITIVE_INFINITY;
    const y = Number(parts[0]),
      m = Number(parts[1]) - 1,
      d = Number(parts[2]);
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d))
      return Number.POSITIVE_INFINITY;
    return Date.UTC(y, m, d);
  };

  const arr = slots.slice();

  arr.sort((a, b) => {
    const aDateVal = dateOnlyVal(a.date);
    const bDateVal = dateOnlyVal(b.date);

    const aIsPast = aDateVal < todayVal;
    const bIsPast = bDateVal < todayVal;

    if (aIsPast !== bIsPast) return aIsPast ? -1 : 1;

    if (aIsPast && bIsPast && aDateVal !== bDateVal) return bDateVal - aDateVal;
    if (!aIsPast && !bIsPast && aDateVal !== bDateVal)
      return aDateVal - bDateVal;

    const aTs = slotDateTimeToMs(a) || Number.POSITIVE_INFINITY;
    const bTs = slotDateTimeToMs(b) || Number.POSITIVE_INFINITY;
    return aTs - bTs;
  });

  return arr;
}

export function validateSlots(slots = [], nowMs = Date.now()) {
  const todayISO = getTodayISO(new Date());

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];

    if (!slot) {
      return {
        valid: false,
        message: "Please fill all slot date/time fields.",
      };
    }

    if (!slot.date || !/^\d{4}-\d{2}-\d{2}$/.test(slot.date)) {
      return {
        valid: false,
        message:
          "Please provide a valid date (year-month-day) for all slots. Example: 2025-12-31.",
      };
    }

    if (!slot.hour || !/^(?:[1-9]|1[0-2])$/.test(String(slot.hour).trim())) {
      return {
        valid: false,
        message: "Please select hour (1-12) for all slots.",
      };
    }

    if (!slot.minute || !/^\d{2}$/.test(String(slot.minute).trim())) {
      return {
        valid: false,
        message: "Please select minute (00-59) for all slots.",
      };
    }

    const mm = Number(String(slot.minute).trim());
    if (Number.isNaN(mm) || mm < 0 || mm > 59) {
      return {
        valid: false,
        message: "Please select a valid minute (00-59) for all slots.",
      };
    }

    const ap = String(slot.ampm || "")
      .trim()
      .toUpperCase();
    if (ap !== "AM" && ap !== "PM") {
      return { valid: false, message: "Please select AM or PM for all slots." };
    }

    if (slot.date > todayISO) continue;

    if (slot.date < todayISO) {
      return {
        valid: false,
        message:
          "One or more slots are in the past. Please pick future date/time for all slots.",
      };
    }

    const slotTs = slotDateTimeToMs(slot);

    if (slotTs <= nowMs) {
      return {
        valid: false,
        message:
          "One or more slots are in the past. Please pick future date/time for all slots.",
      };
    }
  }

  return { valid: true };
}

export function findDuplicateInSlots(slots = []) {
  const seen = new Set();
  for (const s of slots) {
    const key = `${s.date}|${s.hour}|${String(s.minute).padStart(2, "0")}|${s.ampm}`;
    if (seen.has(key)) return key;
    seen.add(key);
  }
  return null;
}

export function slotsToFormattedStrings(slots = [], months = MONTHS) {
  return (slots || []).map((s) => {
    if (typeof s === "string") return s;
    if (s.raw && typeof s.raw === "string" && s.raw.includes("•")) return s.raw;

    const parts = (s.date || "").split("-");
    const year = parts[0] || "";
    const monthNum = Number(parts[1] || "1");
    const day = parts[2] ? String(Number(parts[2])).padStart(2, "0") : "";

    const monthName = MONTHS[monthNum - 1] || MONTHS[0];
    const hour = String(s.hour || "10").padStart(2, "0");
    const minute = String(s.minute || "00").padStart(2, "0");
    const ampm = String(s.ampm || "AM").toUpperCase();

    if (!day || !year) return s.raw || `${hour}:${minute} ${ampm}`;
    return `${day} ${monthName} ${year} • ${hour}:${minute} ${ampm}`;
  });
}

export const availabilityOptions = [
  { value: "true", label: "Available" },
  { value: "false", label: "Unavailable" },
];

export const hourOptions = Array.from({ length: 12 }, (_, i) => {
  const h = String(i + 1);
  return { value: h, label: h };
});

export const minuteOptions = Array.from({ length: 12 }, (_, i) => {
  const m = String(i * 5).padStart(2, "0");
  return { value: m, label: m };
});

export const ampmOptions = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

export const pad2 = (n) => String(n).padStart(2, "0");

export const splitISO = (iso, fallbackISO) => {
  const safe = iso && iso.includes("-") ? iso : fallbackISO;
  const [y, m, d] = String(safe).split("-");
  return { y, m, d };
};

export const daysInMonth = (year, month) => {
  const y = Number(year);
  const m = Number(month);
  return new Date(y, m, 0).getDate();
};

export const buildMonthSelectOptions = () => {
  const MONTH_NAMES = [
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

  return MONTH_NAMES.map((name, i) => {
    const value = pad2(i + 1);
    return { value, label: name };
  });
};

export const buildYearSelectOptions = ({ baseYear, count = 6 }) =>
  Array.from({ length: count }, (_, i) => {
    const v = String(Number(baseYear) + i);
    return { value: v, label: v };
  });

export const buildDaySelectOptions = ({ year, month }) => {
  const max = daysInMonth(year, month);
  return Array.from({ length: max }, (_, i) => {
    const v = pad2(i + 1);
    return { value: v, label: v };
  });
};

export const makeISODate = ({ year, month, day }) =>
  `${year}-${month}-${pad2(day)}`;
