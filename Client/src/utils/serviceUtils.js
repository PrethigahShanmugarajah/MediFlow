// MediFlow / Client / src / utils / serviceUtils.js

/* -------- Converts raw services API data into a clean, consistent service object format. -------- */
export function normalizeServicesResponse(json) {
  const items = (json && (json.data || json)) || [];

  return (Array.isArray(items) ? items : []).map((s) => {
    const id = s._id || s.id;
    const image = s.imageUrl || s.image || s.imageSmall || s.imageSrc || "";

    const available =
      typeof s.availability === "string"
        ? s.availability.toLowerCase() === "available"
        : typeof s.available === "boolean"
          ? s.available
          : typeof s.availability === "boolean"
            ? s.availability
            : s.availability === "Available" || s.available === true;

    return {
      id,
      name: s.name || "Service",
      shortDescription: s.shortDescription || s.about || "",
      price: s.price ?? s.fee ?? 0,
      available,
      image,
      imageSmall: s.imageSmall || null,
      imageMedium: s.imageMedium || null,
      imageLarge: s.imageLarge || null,
      imageSrcSet: s.imageSrcSet || null,
      imageWebp: s.imageWebp || null,
      raw: s,
    };
  });
}

/* -------- Format Service Name (First Letter Capital) -------- */
export function formatServiceName(name) {
  if (!name || typeof name !== "string") return "";

  return name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
