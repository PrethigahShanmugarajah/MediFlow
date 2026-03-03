// MediFlow / Client / src / utils / client / contactUtils.js

/* -------- Validate email format -------- */
export const emailRegex = /^\S+@\S+\.\S+$/;

/* -------- Validate 10-digit phone number -------- */
export const phone10Regex = /^[0-9]{10}$/;

/* -------- Get services based on selected department -------- */
export function getAvailableServices(
  department,
  servicesMapping,
  genericServices,
) {
  return department ? servicesMapping[department] || [] : genericServices;
}

/* -------- Check contact form fields and return errors -------- */
export function validateContactForm(form) {
  const e = {};

  if (!form.name?.trim()) e.name = "Full name is required.";
  if (!form.email?.trim()) e.email = "Email is required.";
  else if (!emailRegex.test(form.email))
    e.email = "Please enter a valid email.";
  if (!form.phone?.trim()) e.phone = "Phone number is required.";
  else if (!phone10Regex.test(form.phone))
    e.phone = "Phone number must be exactly 10 digits.";

  if (!form.department && !form.service) {
    e.department = "Please choose a department or service.";
    e.service = "Please choose a department or service.";
  }

  if (!form.message?.trim()) e.message = "Please write a short message.";

  return e;
}

/* -------- Build formatted WhatsApp message text -------- */
export function buildWhatsAppText(form) {
  return `*Contact Request*\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${
    form.phone
  }\nDepartment: ${form.department || "N/A"}\nService: ${
    form.service || "N/A"
  }\nMessage: ${form.message}`;
}

/* -------- Generate WhatsApp URL with encoded message -------- */
export function buildWhatsAppUrl(phoneRaw, text) {
  const phone = String(phoneRaw || "").replace(/[^\d]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/* -------- Update form state when input changes -------- */
export function getNextFormState(prevForm, name, value) {
  if (name === "department") {
    return { ...prevForm, department: value, service: "" };
  }
  return { ...prevForm, [name]: value };
}

/* -------- Clear error for a specific field -------- */
export function clearFieldError(prevErrors, name) {
  return { ...prevErrors, [name]: undefined };
}

/* -------- Clear department/service errors when one is selected -------- */
export function clearDepartmentServiceErrorsIfSelected(
  prevErrors,
  name,
  value,
  form,
) {
  if (name !== "department" && name !== "service") return prevErrors;

  const copy = { ...prevErrors };

  if (
    (name === "department" && value) ||
    (name === "service" && value) ||
    form.department ||
    form.service
  ) {
    delete copy.department;
    delete copy.service;
  }

  return copy;
}
