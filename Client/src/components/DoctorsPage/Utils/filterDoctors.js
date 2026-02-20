// Client / src / components / DoctorsPage / Utils / filterDoctors.js

export function filterDoctors(doctors, searchTerm) {
  const q = (searchTerm || "").trim().toLowerCase();
  if (!q) return doctors;

  return (doctors || []).filter(
    (doctor) =>
      (doctor.name || "").toLowerCase().includes(q) ||
      (doctor.specialization || "").toLowerCase().includes(q),
  );
}
