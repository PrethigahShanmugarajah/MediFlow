// MediFlow / Client / src / utils / doctorsUtils.js

/* -------- Converts raw doctors API data into a clean, consistent doctor object format. -------- */
export function normalizeDoctorsResponse(json) {
  const items = (json && (json.data || json)) || [];

  return (Array.isArray(items) ? items : []).map((d) => {
    const id = d._id || d.id;
    const image = d.imageUrl || d.image || d.imageSmall || d.imageSrc || "";

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
      specialization: d.specialization || "",
      image,
      experience:
        (d.experience ?? d.experience === 0) ? String(d.experience) : "—",
      fee: d.fee ?? d.price ?? 0,
      available,
      raw: d,
    };
  });
}
