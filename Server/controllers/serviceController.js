// MediFlow / Server / controllers / serviceController.js
import Service from "../models/Service.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {
  normalizeSlotsToMap,
  parseAvailability,
  parseJsonArrayField,
  sanitizePrice,
} from "../utils/serviceHelper.js";

/* -------- Create Service -------- */
export async function createService(req, res) {
  try {
    const b = req.body || {};

    const instructions = parseJsonArrayField(b.instructions);
    const rawSlots = parseJsonArrayField(b.slots);
    const slots = normalizeSlotsToMap(rawSlots);
    const numericPrice = sanitizePrice(b.price);
    const available = parseAvailability(b.availability);

    let imageUrl = null;
    let imagePublicId = null;
    if (req.file) {
      try {
        const up = await uploadToCloudinary(req.file.path, "services");
        imageUrl = up?.secure_url || null;
        imagePublicId = up?.public_id || null;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
      }
    }

    const service = Service({
      name: b.name,
      about: b.about || "",
      shortDescription: b.shortDescription || "",
      price: numericPrice,
      available,
      instructions,
      slots,
      imageUrl,
      imagePublicId,
    });

    const savedService = await service.save();

    return res.status(201).json({
      success: true,
      message: "Service created successfully!",
      data: savedService,
    });
  } catch (error) {
    console.error("Create Service Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service.",
      error: `Create Service Error: ${error?.message || error}`,
    });
  }
}
