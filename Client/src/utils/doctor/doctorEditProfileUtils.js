/* -------- Convert 12h time (hh:mm AM/PM) → minutes -------- */
export function parse12HourTimeToMinutes(t) {
  if (!t) return 0;
  const [time, ampm] = t.split(" ");
  const [hh, mm] = time.split(":");
  let h = Number(hh) % 12;
  if ((ampm || "").toUpperCase() === "PM") h += 12;
  return h * 60 + Number(mm);
}

/* -------- Convert 24h input (HH:mm) → 12h display -------- */
export function formatTimeFromInput(time24) {
  if (!time24) return time24;
  const [h, m] = time24.split(":");
  let hr = Number(h);
  const ampm = hr >= 12 ? "PM" : "AM";
  hr = hr % 12 || 12;
  return `${String(hr).padStart(2, "0")}:${m} ${ampm}`;
}

/* -------- Remove duplicate slots + sort schedule -------- */
export function dedupeAndSortSchedule(schedule = {}) {
  const out = {};
  Object.entries(schedule || {}).forEach(([date, slots]) => {
    const uniq = Array.from(new Set(slots || []));
    uniq.sort(
      (a, b) => parse12HourTimeToMinutes(a) - parse12HourTimeToMinutes(b),
    );
    out[date] = uniq;
  });
  return out;
}

/* -------- Add new date to doctor's schedule -------- */
export function addDateToDocSchedule(doc, dateStr) {
  if (!doc || !dateStr) return { ok: false, doc, message: "Invalid date." };

  const currentSchedule = doc.schedule || {};
  if (currentSchedule[dateStr]) {
    return { ok: false, doc, message: "This date has already been added." };
  }

  const nextDoc = {
    ...doc,
    schedule: { ...currentSchedule, [dateStr]: [] },
  };

  return {
    ok: true,
    doc: nextDoc,
    message: "The date was added successfully.",
  };
}

/* -------- Add time slot to a schedule date -------- */
export function addSlotToDocSchedule(doc, dateStr, time24) {
  if (!doc || !dateStr || !time24) {
    return { ok: false, doc, message: "Invalid time slot." };
  }

  const formatted = formatTimeFromInput(time24);
  const schedule = doc.schedule || {};
  const existing = schedule[dateStr] || [];

  if (existing.includes(formatted)) {
    return {
      ok: false,
      doc,
      message: `${formatted} has already been added for ${dateStr}.`,
    };
  }

  const nextArr = [...existing, formatted];
  nextArr.sort(
    (a, b) => parse12HourTimeToMinutes(a) - parse12HourTimeToMinutes(b),
  );

  const nextDoc = {
    ...doc,
    schedule: { ...schedule, [dateStr]: nextArr },
  };

  return {
    ok: true,
    doc: nextDoc,
    message: `The time slot ${formatted} was added successfully.`,
  };
}

/* -------- Remove a time slot from schedule -------- */
export function removeSlotFromDocSchedule(doc, dateStr, slot) {
  if (!doc || !dateStr || !slot) return { ok: false, doc };

  const schedule = doc.schedule || {};
  const next = (schedule[dateStr] || []).filter((s) => s !== slot);

  const nextDoc = {
    ...doc,
    schedule: { ...schedule, [dateStr]: next },
  };

  return {
    ok: true,
    doc: nextDoc,
    message: `The time slot ${slot} was removed from ${dateStr}.`,
  };
}

/* -------- Remove a full date from schedule -------- */
export function removeDateFromDocSchedule(doc, dateStr) {
  if (!doc || !dateStr) return { ok: false, doc };

  const schedule = doc.schedule || {};
  const clone = { ...schedule };
  delete clone[dateStr];

  const nextDoc = { ...doc, schedule: clone };

  return {
    ok: true,
    doc: nextDoc,
    message: `The date ${dateStr} was removed successfully.`,
  };
}

/* -------- Get doctor image URL safely -------- */
export function getDoctorImageUrl(rawDoc) {
  if (!rawDoc) return "";
  return rawDoc.imageUrl ?? rawDoc.image ?? "";
}

/* -------- Normalize doctor data from API -------- */
export function normalizeDoctorFromApi(json) {
  const d = json?.data || json || {};
  return {
    ...d,
    schedule: dedupeAndSortSchedule(d.schedule || {}),
    imageUrl: getDoctorImageUrl(d),
  };
}

/* -------- Build FormData for doctor update API -------- */
export function buildDoctorUpdateFormData(doc, localImageFile) {
  const form = new FormData();

  const updatable = [
    "name",
    "specialization",
    "experience",
    "qualifications",
    "location",
    "about",
    "fee",
    "availability",
    "success",
    "patients",
    "rating",
    "email",
  ];

  updatable.forEach((k) => {
    if (doc?.[k] !== undefined && doc?.[k] !== null) {
      form.append(k, String(doc[k]));
    }
  });

  form.append("schedule", JSON.stringify(doc?.schedule || {}));

  if (localImageFile) {
    form.append("image", localImageFile);
  } else if (doc?.imageUrl && !doc.imageUrl.startsWith("blob:")) {
    form.append("imageUrl", doc.imageUrl);
  }

  return form;
}
