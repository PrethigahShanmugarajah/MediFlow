// Client / src / components / DoctorsPage / Utils / normalizeDoctors.js

export function normalizeDoctors(list) {
  const arr = Array.isArray(list) ? list : [];

  return arr.map((d) => {
    const id = d._id || d.id;
    const image = d.imageUrl || d.image || d.imageSmall || d.imageSrc || "";

    let available = true;
    if (typeof d.availability === "string") {
      available = d.availability.toLowerCase() === "available";
    } else if (typeof d.available === "boolean") {
      available = d.available;
    } else if (typeof d.availability === "boolean") {
      available = d.availability;
    } else {
      available = d.availability === "Available" || d.available === true;
    }

    const exp =
      d.experience !== undefined && d.experience !== null
        ? String(d.experience)
        : "—";

    return {
      id,
      name: d.name || "Unknown",
      specialization: d.specialization || "",
      image,
      experience: exp,
      fee: d.fee ?? d.price ?? 0,
      available,
      raw: d,
    };
  });
}
