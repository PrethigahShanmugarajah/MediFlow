// MediFlow / Client / src / utils / client / serviceDetailUtils.js

/* -------- Get all dates from slots map, past first then future -------- */
export function getScheduleDates(slots) {
  if (!slots) return [];

  const keys =
    typeof slots === "object" && !Array.isArray(slots)
      ? Object.keys(slots)
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
    .sort((a, b) => dateOnlyValue(a.date) - dateOnlyValue(a.date));

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
export function validateServiceBooking({
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
    return { ok: false, message: "Please sign in to create a booking." };

  return { ok: true, message: "" };
}

/* -------- Build payload for creating a service appointment -------- */
export function buildServiceAppointmentPayload({
  service,
  formData,
  selectedDate,
  selectedSlot,
  fee,
  paymentMethod,
}) {
  const mobileDigits = (formData.mobile || "").replace(/\D/g, "");
  const dateISO = selectedDate.toISOString().split("T")[0];

  return {
    serviceId: service?._id || service?.id,
    serviceName: service?.name || "",
    serviceImageUrl: service?.imageUrl || service?.image || "",
    serviceImagePublicId:
      service?.imagePublicId || service?.image?.publicId || "",
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
export function getSlotsForSelectedDate(slots, selectedDate) {
  if (!selectedDate || !slots) return [];
  const key = selectedDate.toISOString().split("T")[0];
  return slots?.[key] || [];
}

/* -------- Redirect after booking, handle checkout URL -------- */
export function handleServiceAppointmentRedirect(body) {
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

/* -------- Smart Service Name Formatter -------- */
export function formatServiceName(name) {
  if (!name || typeof name !== "string") return "";
  return name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
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
