import { NoImage, NoPersonImage } from "../../assets";

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

/* -------- Keep only last 10 digits of a phone number -------- */
export function normalizePhoneTo10(phone) {
  if (!phone) return "";
  const digits = ("" + phone).replace(/\D/g, "");
  if (!digits) return "";
  return digits.length <= 10 ? digits : digits.slice(-10);
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

/* -------- Keep only first 10 digits of mobile input -------- */
export function sanitizeMobile10(value) {
  return (value || "").replace(/\D/g, "").slice(0, 10);
}

/* -------- Get all dates from schedule/slots, past first then future -------- */
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

/* -------- Redirect after booking, handle checkout URL -------- */
export function handleBookingRedirect(body) {
  if (body?.checkoutUrl) {
    window.location.href = body.checkoutUrl;
    return true;
  }

  setTimeout(() => {
    window.location.href = "/appointments?payment_status=Pending";
  }, 700);

  return true;
}

/* -------- Converts raw doctors API data into a clean, consistent doctor object format. -------- */
export function normalizeDoctor(d) {
  const id = d._id || d.id;
  const image =
    d.imageUrl || d.image || d.imageSmall || d.imageSrc || NoPersonImage;

  const available =
    typeof d.availability === "string"
      ? d.availability.toLowerCase() === "available"
      : typeof d.available === "boolean"
        ? d.available
        : typeof d.availability === "boolean"
          ? d.availability
          : d.availability === "Available" || d.available === true;

  return {
    id,
    name: d.name || "Unknown",
    specialization: d.specialization || "-",
    image,
    experience: d.experience || d.experience === 0 ? String(d.experience) : "-",
    fee: d.fee ?? d.price ?? 0,
    available,
    raw: d,
  };
}

/* -------- Check if patient booking form is valid -------- */
export function validatePatientBooking({
  formData,
  selectedDate,
  selectedSlot,
  authLoaded,
  userLoaded,
  isSignedIn,
  actionLabel = "booking",
}) {
  if (
    !formData?.name ||
    !formData?.age ||
    !formData?.mobile ||
    !formData?.gender
  ) {
    return {
      ok: false,
      message: "Please complete all required patient details.",
    };
  }

  const mobileDigits = (formData.mobile || "").replace(/\D/g, "");
  if (mobileDigits.length !== 10) {
    return {
      ok: false,
      message: "The mobile number must contain exactly 10 digits.",
    };
  }

  if (!selectedDate || !selectedSlot) {
    return {
      ok: false,
      message: "Please select both a date and a time slot.",
    };
  }

  if (!authLoaded || !userLoaded) {
    return {
      ok: false,
      message: "Authentication is not yet available. Please try again shortly.",
    };
  }

  if (!isSignedIn) {
    return {
      ok: false,
      message: `Please sign in to create a ${actionLabel}.`,
    };
  }

  return { ok: true, message: "" };
}

/* -------- Build common booking payload fields shared by doctor and service appointments -------- */
export function buildBookingPayload({
  formData,
  selectedDate,
  selectedSlot,
  fee,
  paymentMethod,
}) {
  const mobileDigits = (formData.mobile || "").replace(/\D/g, "");
  const dateISO = selectedDate.toISOString().split("T")[0];

  return {
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

/* -------- Normalize one service object -------- */
export function normalizeService(s) {
  const id = s._id || s.id;

  const image = s.imageUrl || s.image || NoImage;

  const available =
    typeof s.available === "boolean"
      ? s.available
      : s.available === "Available" ||
        (typeof s.availability === "string" &&
          s.availability.toLowerCase() === "available");

  return {
    id,
    name: s.name || "Service",
    description: s.shortDescription || s.about || "",
    price: s.price ?? s.fee ?? 0,
    image,

    imageSmall: s.imageSmall || null,
    imageMedium: s.imageMedium || null,
    imageLarge: s.imageLarge || null,
    imageSrcSet: s.imageSrcSet || null,
    imageWebp: s.imageWebp || null,

    available,
    raw: s,
  };
}
