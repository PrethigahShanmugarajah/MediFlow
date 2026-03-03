// MediFlow / Client / src / utils / client / homeUtils.js

/* -------- Home Doctors -------- */
export function normalizeHomeDoctorsResponse(json) {
  const items = (json && (json.data || json)) || [];

  return (Array.isArray(items) ? items : []).map((d) => {
    const id = d._id || d.id;
    const image = d.imageUrl || d.image || d.imageSmall || d.imageSrc || "";

    const available =
      (typeof d.availability === "string"
        ? d.availability.toLowerCase() === "available"
        : typeof d.available === "boolean"
          ? d.available
          : d.availability === true) || d.availability === "Available";

    return {
      id,
      name: d.name || "Unknown",
      specialization: d.specialization || "",
      image,
      experience:
        d.experience || d.experience === 0 ? String(d.experience) : "",
      fee: d.fee ?? d.price ?? 0,
      available,
      raw: d,
    };
  });
}

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

/* -------- Home Services -------- */
export function normalizeHomeServicesResponse(json) {
  const items = (json && (json.data || json)) || [];

  return (Array.isArray(items) ? items : []).map((s) => ({
    id: s._id || s.id,
    name: s.name || "Unknown Service",
    description: s.shortDescription || s.about || "",
    price: s.price ?? 0,
    image: s.imageUrl || s.image || "",
    available:
      typeof s.available === "boolean"
        ? s.available
        : s.available === "Available",
    raw: s,
  }));
}

export function formatServiceName(name) {
  if (!name || typeof name !== "string") return "";

  return name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
