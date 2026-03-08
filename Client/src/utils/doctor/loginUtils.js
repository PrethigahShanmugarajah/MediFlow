/* -------- Extract token and doctor ID from API response -------- */
export const extractDoctorAuth = (json) => {
  const token = json?.token || json?.data?.token || null;

  const doctorId =
    json?.data?._id || json?.doctor?._id || json?.data?.doctor?._id || null;

  return { token, doctorId };
};

/* -------- Save doctor token in localStorage -------- */
export const persistDoctorToken = (storageKey, token) => {
  if (!storageKey || !token) return false;

  localStorage.setItem(storageKey, token);

  window.dispatchEvent(
    new StorageEvent("storage", { key: storageKey, newValue: token }),
  );

  return true;
};
