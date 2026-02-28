// MediFlow / Client / src / utils / helpers.js

/* -------- Get the currency symbol -------- */
export const CURRENCY = import.meta.env.VITE_CURRENCY;

/* -------- Options for patient gender selection -------- */
export const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];
