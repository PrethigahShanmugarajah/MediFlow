/* -------- Convert a time string to total minutes -------- */
export function timeStringToMinutes(t) {
  if (!t) return 0;
  const [hhmm, ampm] = t.split(" ");
  let [h, m] = hhmm.split(":").map(Number);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

/* -------- Flatten the schedule object into an array of {date, time} -------- */
export function getFlatSlots(schedule = {}) {
  const arr = [];
  Object.keys(schedule)
    .sort()
    .forEach((date) => {
      (schedule[date] || []).forEach((time) => arr.push({ date, time }));
    });
  return arr;
}

/* -------- Check if a slot can be added (not in past) -------- */
export function canAddSlot({
  slotDate,
  slotHour,
  slotMinute,
  slotAmpm,
  today,
}) {
  if (!slotDate || !slotHour) {
    return { ok: false, message: "Please select a date and time" };
  }

  if (slotDate < today) {
    return { ok: false, message: "You cannot add a slot in the past" };
  }

  const time = `${slotHour}:${slotMinute} ${slotAmpm}`;

  if (slotDate === today) {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const slotMinutes = timeStringToMinutes(time);

    if (slotMinutes <= nowMinutes) {
      return {
        ok: false,
        message: "You cannot add a time that has already passed today",
      };
    }
  }

  return { ok: true, time };
}

/* -------- Add a slot to the schedule object -------- */
export function addSlotToSchedule(schedule = {}, slotDate, time) {
  const next = { ...schedule };
  if (!next[slotDate]) next[slotDate] = [];

  if (!next[slotDate].includes(time)) next[slotDate].push(time);

  next[slotDate] = next[slotDate].sort(
    (a, b) => timeStringToMinutes(a) - timeStringToMinutes(b),
  );

  return next;
}

/* -------- Remove a slot from the schedule -------- */
export function removeSlotFromSchedule(schedule = {}, date, time) {
  const next = { ...schedule };
  next[date] = (next[date] || []).filter((t) => t !== time);
  if (!next[date]?.length) delete next[date];
  return next;
}

/* -------- Validate the doctor form fields -------- */
export function validateDoctorForm(form) {
  const req = [
    "name",
    "specialization",
    "experience",
    "qualifications",
    "location",
    "about",
    "fee",
    "success",
    "patients",
    "rating",
    "email",
    "password",
  ];

  for (let k of req) {
    if (!form?.[k]) return { ok: false, message: "Please fill all fields" };
  }

  if (!form?.imageFile) {
    return { ok: false, message: "Please upload an image" };
  }

  if (!Object.keys(form?.schedule || {}).length) {
    return { ok: false, message: "Please add at least one slot" };
  }

  const r = Number(form.rating);
  if (Number.isNaN(r) || r < 1 || r > 5) {
    return { ok: false, message: "Rating must be a number from 1 to 5" };
  }

  return { ok: true };
}

/* -------- Build FormData for doctor form submission -------- */
export function buildDoctorFormData(form) {
  const fd = new FormData();

  fd.append("name", form.name);
  fd.append("specialization", form.specialization || "");
  fd.append("experience", form.experience || "");
  fd.append("qualifications", form.qualifications || "");
  fd.append("location", form.location || "");
  fd.append("about", form.about || "");
  fd.append("fee", form.fee === "" ? "0" : String(form.fee));
  fd.append("success", form.success || "");
  fd.append("patients", form.patients || "");
  fd.append("rating", form.rating === "" ? "0" : String(form.rating));
  fd.append("availability", form.availability || "Available");
  fd.append("email", form.email);
  fd.append("password", form.password);
  fd.append("schedule", JSON.stringify(form.schedule || {}));

  if (form.imageFile) fd.append("image", form.imageFile);

  return fd;
}

/* -------- Return initial empty doctor form -------- */
export function initialDoctorForm() {
  return {
    name: "",
    specialization: "",
    imageFile: null,
    imagePreview: "",
    experience: "",
    qualifications: "",
    location: "",
    about: "",
    fee: "",
    success: "",
    patients: "",
    rating: "",
    schedule: {},
    availability: "Available",
    email: "",
    password: "",
  };
}

/* -------- Clear preview URL to free memory -------- */
export function clearImagePreview(previewUrl) {
  if (!previewUrl) return;
  try {
    URL.revokeObjectURL(previewUrl);
  } catch {}
}

/* -------- Create new image preview from file -------- */
export function createImagePreview(file, prevPreviewUrl) {
  clearImagePreview(prevPreviewUrl);

  return {
    imageFile: file,
    imagePreview: URL.createObjectURL(file),
  };
}

/* -------- Clear file input safely -------- */
export function safeClearFileInput(fileInputRef) {
  if (!fileInputRef?.current) return;
  try {
    fileInputRef.current.value = "";
  } catch {}
}

/* -------- Create a preview object from API response -------- */
export function makeDoctorPreviewFromResponse(data, form) {
  if (data?.data) return data.data;
  return { id: Date.now(), ...form, imageUrl: form.imagePreview };
}

/* -------- Get current time rounded up to next 5 minutes in 12-hour format -------- */
export function getCurrentTimeNow() {
  const d = new Date();

  let hour24 = d.getHours();
  let minute = d.getMinutes();

  const remainder = minute % 5;
  if (remainder !== 0) {
    minute += 5 - remainder;
  }

  if (minute === 60) {
    minute = 0;
    hour24 = (hour24 + 1) % 24;
  }

  const ampm = hour24 >= 12 ? "PM" : "AM";

  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;

  return {
    hour: String(hour12).padStart(2, "0"),
    minute: String(minute).padStart(2, "0"),
    ampm,
  };
}
