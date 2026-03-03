// MediFlow / Client / src / utils / client / doctorDetailUtils.js

/* -------- Get all dates from schedule, past first then future -------- */
export function getScheduleDates(schedule) {
  if (!schedule) return [];

  const keys =
    typeof schedule === "object" && !Array.isArray(schedule)
      ? Object.keys(schedule)
      : [];

  const parsed = keys
    .map((k) => {
      const d = new Date(k);
      if (!isNaN(d)) return { key: k, date: d };

      const parts = k.split("-").map((n) => Number(n));
      if (parts.length >= 3) {
        const [y, m, day] = parts;
        const dd = new Date(y, m - 1, day);
        if (!isNaN(dd)) return { key: k, date: dd };
      }
      return null;
    })
    .filter(Boolean);

  const dateOnlyValue = (d) =>
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

  const today = new Date();
  const todayVal = dateOnlyValue(today);

  const past = parsed
    .filter((p) => dateOnlyValue(p.date) < todayVal)
    .sort((a, b) => dateOnlyValue(b.date) - dateOnlyValue(a.date));

  const future = parsed
    .filter((p) => dateOnlyValue(p.date) >= todayVal)
    .sort((a, b) => dateOnlyValue(a.date) - dateOnlyValue(b.date));

  return [...past, ...future].map((p) => p.date);
}

/* -------- Keep only last 10 digits of a phone number -------- */
export function normalizePhoneTo10(phone) {
  if (!phone) return "";
  const digits = ("" + phone).replace(/\D/g, "");
  if (!digits) return "";
  return digits.length <= 10 ? digits : digits.slice(-10);
}

/* -------- Check if booking form is valid -------- */
export function validateBooking({
  formData,
  selectedDate,
  selectedSlot,
  authLoaded,
  userLoaded,
  isSignedIn,
}) {
  if (
    !formData?.name ||
    !formData?.age ||
    !formData?.mobile ||
    !formData?.gender
  )
    return {
      ok: false,
      message: "Please complete all required patient details.",
    };

  const mobileDigits = (formData.mobile || "").replace(/\D/g, "");
  if (mobileDigits.length !== 10)
    return {
      ok: false,
      message: "The mobile number must contain exactly 10 digits.",
    };

  if (!selectedDate || !selectedSlot)
    return { ok: false, message: "Please select both a date and a time slot." };

  if (!authLoaded || !userLoaded)
    return {
      ok: false,
      message: "Authentication is not yet available. Please try again shortly.",
    };

  if (!isSignedIn)
    return { ok: false, message: "Please sign in to create an appointment." };

  return { ok: true, message: "" };
}

/* -------- Build payload for creating an appointment -------- */
export function buildAppointmentPayload({
  doctor,
  formData,
  selectedDate,
  selectedSlot,
  fee,
  paymentMethod,
}) {
  const mobileDigits = (formData.mobile || "").replace(/\D/g, "");
  const dateISO = selectedDate.toISOString().split("T")[0];

  const doctorNameValue = doctor?.name || "";
  const specialityValue =
    doctor?.specialization ||
    doctor?.speciality ||
    doctor?.specialityName ||
    "";

  const ownerValue = doctor?.owner || undefined;

  return {
    doctorId: doctor?._id || doctor?.id,
    doctorName: doctorNameValue,
    speciality: specialityValue,
    owner: ownerValue,
    doctorImageUrl: doctor?.imageUrl || doctor?.image || "",
    doctorImagePublicId: doctor?.imagePublicId || doctor?.image?.publicId || "",
    patientName: formData.name,
    mobile: mobileDigits,
    age: formData.age,
    gender: formData.gender,
    date: dateISO,
    time: selectedSlot,
    fee,
    fees: fee,
    paymentMethod: paymentMethod || "Online",
    email: formData.email || undefined,
  };
}

/* -------- Get pre-filled patient info from Clerk user -------- */
export function getPrefillFromClerkUser(user) {
  if (!user) return { fullName: "", phone: "", email: "" };

  const fullName =
    user.fullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "";

  const rawPhone =
    user.primaryPhone ||
    (user.phoneNumbers && user.phoneNumbers.length > 0
      ? user.phoneNumbers[0]
      : "") ||
    "";

  const phone = normalizePhoneTo10(rawPhone);

  const email =
    (user.emailAddresses && user.emailAddresses[0]?.emailAddress) ||
    user.primaryEmailAddress ||
    "";

  return { fullName, phone, email };
}

/* -------- Get available slots for a selected date -------- */
export function getSlotsForSelectedDate(schedule, selectedDate) {
  if (!selectedDate || !schedule) return [];
  const key = selectedDate.toISOString().split("T")[0];
  return schedule?.[key] || [];
}

/* -------- Redirect after booking, handle checkout URL -------- */
export function handleAppointmentRedirect(body) {
  if (body?.checkoutUrl) {
    window.location.href = body.checkoutUrl;
    return true;
  }

  setTimeout(() => {
    window.location.href = "/appointments?payment_status=Pending";
  }, 700);

  return true;
}

/* -------- Keep only first 10 digits of mobile input -------- */
export function sanitizeMobile10(value) {
  return (value || "").replace(/\D/g, "").slice(0, 10);
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

/* -------- Options for patient gender selection -------- */
export const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

/* -------- Options for payment method selection -------- */
export const paymentOptions = [
  { value: "Cash", label: "Cash" },
  { value: "Online", label: "Online" },
];
