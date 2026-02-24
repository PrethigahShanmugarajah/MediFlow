// MediFlow / Admin / src / utils / listServicesUtils.js

/* -------- List of month -------- */
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

/* -------- Return today's date as "YYYY-MM-DD" -------- */
export function getTodayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/* -------- Convert "YYYY-MM-DD" to human readable "DD Mon YYYY" -------- */
export function formatDateHuman(dateStr, months = MONTHS) {
  if (!dateStr) return "";
  const parts = String(dateStr).split("-");
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const mon = months[Number(m) - 1] || m;
  return `${String(Number(d))} ${mon} ${y}`;
}

/* -------- Convert slot object to milliseconds timestamp -------- */
export function slotDateTimeToMs(slot) {
  const [y, m, d] = String(slot?.date || "").split("-");
  if (!y || !m || !d) return 0;

  let h = Number(slot?.hour || 0);
  const mm = Number(slot?.minute || 0);
  const ap = String(slot?.ampm || "AM").toUpperCase();

  if (ap === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h = h + 12;
  }

  return new Date(Number(y), Number(m) - 1, Number(d), h, mm, 0, 0).getTime();
}

/* -------- Sort slots for display: past first (descending), future next (ascending) -------- */
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

/* -------- Convert slot strings into structured objects for UI -------- */
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
        minute = String(Number(isoMatch[3] || "0")).padStart(2, "0");
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
      return {
        id: `s-${idx}`,
        date: "",
        hour: String(Number(timeOnly[1])),
        minute: String(timeOnly[2]).padStart(2, "0"),
        ampm: (timeOnly[3] || "AM").toUpperCase(),
        raw,
      };
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

/* -------- Parse frontend slot string into object -------- */
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
    slot.minute = String(Number(isoMatch[2])).padStart(2, "0");

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

/* -------- Convert slots map/object to array of slot objects -------- */
export function convertSlotsMapToArray(slotsMap) {
  try {
    const out = [];
    if (slotsMap instanceof Map) {
      for (const [date, arr] of slotsMap.entries()) {
        (arr || []).forEach((t, idx) =>
          out.push({
            id: `${date}-${idx}`,
            ...parseFrontendSlotString(date, t),
            raw: t,
          }),
        );
      }
    } else {
      for (const date of Object.keys(slotsMap || {})) {
        (slotsMap[date] || []).forEach((t, idx) =>
          out.push({
            id: `${date}-${idx}`,
            ...parseFrontendSlotString(date, t),
            raw: t,
          }),
        );
      }
    }
    return out;
  } catch {
    return [];
  }
}

/* -------- Convert slot objects to display strings -------- */
export function slotsToFormattedStrings(slots = [], months = MONTHS) {
  return (slots || []).map((s) => {
    if (typeof s === "string") return s;
    if (s?.raw && typeof s.raw === "string" && s.raw.includes("•"))
      return s.raw;

    const parts = String(s?.date || "").split("-");
    const year = parts[0] || "";
    const monthNum = Number(parts[1] || "1");
    const day = parts[2] ? String(Number(parts[2])).padStart(2, "0") : "";
    const monthName = months[monthNum - 1] || months[0];

    const hour = String(s?.hour || "10").padStart(2, "0");
    const minute = String(s?.minute || "00").padStart(2, "0");
    const ampm = String(s?.ampm || "AM").toUpperCase();

    if (!day || !year) return s?.raw || `${hour}:${minute} ${ampm}`;
    return `${day} ${monthName} ${year} • ${hour}:${minute} ${ampm}`;
  });
}

/* -------- Check for duplicate slot in array, return key if found -------- */
export function findDuplicateInSlots(slots = []) {
  const seen = new Set();
  for (const s of slots || []) {
    const key = `${s.date}|${s.hour}|${String(s.minute).padStart(2, "0")}|${s.ampm}`;
    if (seen.has(key)) return key;
    seen.add(key);
  }
  return null;
}

/* -------- Check if all slots are valid and in the future -------- */
export function validateSlots(slots = [], nowMs = Date.now()) {
  for (let i = 0; i < (slots || []).length; i++) {
    const slot = slots[i];

    if (!slot)
      return {
        valid: false,
        message: "Please fill all slot date/time fields.",
      };
    if (!slot.date || !/^\d{4}-\d{2}-\d{2}$/.test(slot.date))
      return {
        valid: false,
        message:
          "Please provide a valid date (year-month-day) for all slots. Example: 2025-12-31.",
      };
    if (!slot.hour || !/^(?:[1-9]|1[0-2])$/.test(String(slot.hour)))
      return {
        valid: false,
        message: "Please select hour (1-12) for all slots.",
      };
    if (!slot.minute || !/^\d{2}$/.test(String(slot.minute)))
      return {
        valid: false,
        message: "Please select minute (00-59) for all slots.",
      };
    if (!slot.ampm || (slot.ampm !== "AM" && slot.ampm !== "PM"))
      return { valid: false, message: "Please select AM or PM for all slots." };

    const slotTs = slotDateTimeToMs(slot);
    if (slotTs <= nowMs)
      return {
        valid: false,
        message:
          "One or more slots are in the past. Please pick future date/time for all slots.",
      };
  }
  return { valid: true };
}

/* -------- Normalize service object from API to standard format -------- */
export function normalizeServiceFromApi(s) {
  return {
    id: s?._id || s?.id,
    name: s?.name || "",
    about: s?.about || "",
    instructions: s?.instructions || s?.preInstructions || [],
    instructionsText: (s?.instructions || s?.preInstructions || []).join("\n"),
    price: s?.price ?? s?.fee ?? 0,
    available: s?.available ?? s?.availability === "Available",
    image: s?.image || s?.imageUrl || s?.imageSrc || s?.imageSmall || "",
    _raw: s,
  };
}

/* -------- Get next numeric ID for a new slot -------- */
export function getNextSlotId(slots = []) {
  const max = (slots || []).reduce((acc, s) => {
    const n = Number(String(s?.id || "0").replace(/\D/g, "")) || 0;
    return Math.max(acc, n);
  }, 0);
  return max + 1;
}

/* -------- Filter services by search text and availability -------- */
export function filterServices(services = [], search = "", filterMode = "all") {
  const q = String(search || "")
    .trim()
    .toLowerCase();

  return (services || [])
    .filter((s) =>
      String(s?.name || "")
        .toLowerCase()
        .includes(q),
    )
    .filter((s) => {
      if (filterMode === "all") return true;
      if (filterMode === "available") return s?.available === true;
      if (filterMode === "unavailable") return s?.available === false;
      return true;
    });
}

/* -------- Create a default new slot object -------- */
export function makeDefaultSlot(nextId, dateISO) {
  return {
    id: `s-${nextId}`,
    date: dateISO,
    hour: "10",
    minute: "00",
    ampm: "AM",
  };
}

/* -------- Build edit form state from latest service data -------- */
export function buildEditFormFromService(latest) {
  return {
    id: latest?._id || latest?.id,
    name: latest?.name || "",
    about: latest?.about || "",
    instructionsText: (
      latest?.instructions ||
      latest?.preInstructions ||
      []
    ).join("\n"),
    price: latest?.price ?? latest?.fee ?? 0,
    available:
      latest?.available ?? latest?.availability === "Available" ?? true,
    imagePreview: latest?.imageUrl || latest?.image || latest?.imageSrc || "",
    imageFile: null,
    slots: Array.isArray(latest?.slots)
      ? convertSlotsForUI(latest.slots)
      : convertSlotsMapToArray(latest?.slots),
  };
}

/* -------- Parse multi-line instructions text into array -------- */
export function parseInstructionsText(text = "") {
  return String(text)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/* -------- Build FormData for sending service form to API -------- */
export function buildServiceFormData(editForm, instructionsArray) {
  const fd = new FormData();
  fd.append("name", editForm?.name || "");
  fd.append("about", editForm?.about || "");
  fd.append("price", String(Number(editForm?.price || 0)));
  fd.append("availability", editForm?.available ? "available" : "unavailable");

  fd.append("instructions", JSON.stringify(instructionsArray || []));

  const slotsFormatted = slotsToFormattedStrings(editForm?.slots || []);
  fd.append("slots", JSON.stringify(slotsFormatted));

  if (editForm?.imageFile) fd.append("image", editForm.imageFile);

  return fd;
}

/* -------- Normalize list of services for UI -------- */
export function normalizeServicesList(items = []) {
  return (items || []).map((s) => {
    const base = normalizeServiceFromApi(s);

    const slots = Array.isArray(s?.slots)
      ? convertSlotsForUI(s.slots)
      : s?.slots && typeof s.slots === "object"
        ? convertSlotsMapToArray(s.slots)
        : [];

    return { ...base, slots };
  });
}

/* -------- Merge updated service data with existing service -------- */
export function mergeUpdatedService(
  oldService,
  editForm,
  updatedRaw,
  instructions,
) {
  const id = editForm?.id;

  return {
    id,
    name: editForm?.name || "",
    about: editForm?.about || "",
    instructions: instructions || [],
    instructionsText: (instructions || []).join("\n"),
    price: Number(editForm?.price) || 0,
    available: !!editForm?.available,
    image:
      updatedRaw?.imageUrl ||
      updatedRaw?.image ||
      editForm?.imagePreview ||
      oldService?.image ||
      "",
    slots:
      updatedRaw?.slots && Array.isArray(updatedRaw.slots)
        ? convertSlotsForUI(updatedRaw.slots)
        : editForm?.slots || oldService?.slots || [],
    _raw: updatedRaw || oldService?._raw,
  };
}

/* -------- Check slots are valid and no duplicates exist -------- */
export function validateSlotsAndNoDuplicates(slots = [], formatDateHumanFn) {
  const validation = validateSlots(slots || []);
  if (!validation.valid) return { ok: false, message: validation.message };

  const dupKey = findDuplicateInSlots(slots || []);
  if (dupKey) {
    const [date, hour, minute, ampm] = dupKey.split("|");
    const d = formatDateHumanFn ? formatDateHumanFn(date) : date;
    return {
      ok: false,
      message: `A duplicate time slot was detected for ${d} at ${hour}:${minute} ${ampm}.`,
    };
  }

  return { ok: true };
}

/* -------- Update a specific field of a slot in the edit form -------- */
export function updateSlotInEditForm(editForm, slotId, field, value, todayISO) {
  const form = editForm || { slots: [] };

  if (field === "date" && value && todayISO && value < todayISO) {
    return {
      nextForm: form,
      errorMsg:
        "You cannot select a past date. Please choose today or a future date.",
      dupMsg: null,
    };
  }

  const nextSlots = (form.slots || []).map((s) =>
    s.id === slotId ? { ...s, [field]: value } : s,
  );

  const dupKey = findDuplicateInSlots(nextSlots);
  let dupMsg = null;

  if (dupKey) {
    const [date, hour, minute, ampm] = dupKey.split("|");
    dupMsg = `A duplicate time slot has been detected for ${formatDateHuman(date)} at ${hour}:${minute} ${ampm}.`;
  }

  return {
    nextForm: { ...form, slots: nextSlots },
    errorMsg: null,
    dupMsg,
  };
}

/* -------- Build edit form state from latest service data and sort slots -------- */
export function buildEditStateFromLatest(latest) {
  const normalized = buildEditFormFromService(latest);
  normalized.slots = sortSlotsForDisplay(normalized.slots || []);
  return normalized;
}
/* -------- Update a service in the list with edited data -------- */
export function applyUpdatedServiceToList(
  list,
  id,
  editForm,
  updatedRaw,
  instructions,
) {
  return (list || []).map((s) =>
    s.id === id
      ? mergeUpdatedService(s, editForm, updatedRaw, instructions)
      : s,
  );
}

/* -------- Safely replace image preview URL, revoke old blob if needed -------- */
export function safeReplaceImagePreview(prevPreview, file) {
  if (
    prevPreview &&
    typeof prevPreview === "string" &&
    prevPreview.startsWith("blob:")
  ) {
    try {
      URL.revokeObjectURL(prevPreview);
    } catch {}
  }
  const nextUrl = file ? URL.createObjectURL(file) : "";
  return nextUrl;
}

/* -------- Build payload (FormData + instructions + id) for updating service -------- */
export function buildUpdatePayloadFromEditForm(editForm) {
  const instructions = parseInstructionsText(editForm?.instructionsText);
  const fd = buildServiceFormData(editForm, instructions);
  const id = editForm?.id;
  return { id, fd, instructions };
}

/* -------- Add a default slot to the edit form -------- */
export function addDefaultSlotToForm(editForm, todayISO) {
  const nextId = getNextSlotId(editForm?.slots || []);
  const newSlot = makeDefaultSlot(nextId, todayISO);
  return { ...(editForm || {}), slots: [...(editForm?.slots || []), newSlot] };
}

/* -------- Remove a slot from the edit form by ID -------- */
export function removeSlotFromForm(editForm, slotId) {
  const nextSlots = (editForm?.slots || []).filter((s) => s.id !== slotId);
  return { ...(editForm || {}), slots: nextSlots };
}
