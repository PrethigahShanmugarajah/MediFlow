import Service from "../models/Service.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
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

    let imageUrl = b.imageUrl || null;
    let imagePublicId = null;
    if (req.file) {
      try {
        const up = await uploadToCloudinary(req.file.path, "services");
        imageUrl = up?.secure_url || null;
        imagePublicId = up?.public_id || null;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
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
    console.error(
      "Create Service Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create service.",
      error: `Create Service Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Services -------- */
export async function getServices(req, res) {
  try {
    const listServices = await Service.find().sort({ createdAt: -1 }).lean();

    if (!listServices) {
      return res.status(200).json({
        success: true,
        message: "No services found.",
        data: [],
      });
    }

    if (listServices.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No services found.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Services fetched successfully!",
      data: listServices,
    });
  } catch (error) {
    console.error(
      "Get Services Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services.",
      error: `Get Services Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Service By ID -------- */
export async function getServiceById(req, res) {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).lean();
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service fetched successfully!",
      data: service,
    });
  } catch (error) {
    console.error(
      "Get Service Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service.",
      error: `Get Service Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Update Service -------- */
export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const existingService = await Service.findById(id);

    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    const b = req.body || {};
    const updateData = {};

    if (b.name !== undefined) updateData.name = b.name;
    if (b.about !== undefined) updateData.about = b.about;
    if (b.shortDescription !== undefined)
      updateData.shortDescription = b.shortDescription;
    if (b.price !== undefined) updateData.price = sanitizePrice(b.price);
    if (b.availability !== undefined)
      updateData.available = parseAvailability(b.availability);
    if (b.instructions !== undefined)
      updateData.instructions = parseJsonArrayField(b.instructions);
    if (b.slots !== undefined)
      updateData.slots = normalizeSlotsToMap(parseJsonArrayField(b.slots));

    if (req.file) {
      try {
        const up = await uploadToCloudinary(req.file.path, "services");
        if (up?.secure_url) {
          updateData.imageUrl = up.secure_url;
          updateData.imagePublicId = up.public_id || null;
          if (existingService.imagePublicId) {
            try {
              await deleteFromCloudinary(existingService.imagePublicId);
            } catch (error) {
              console.warn(
                "Cloudinary delete failed:",
                error?.message || error,
              );
            }
          }
        }
      } catch (error) {
        console.error("Cloudinary upload error:", error);
      }
    }

    const updatedService = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Service updated successfully!",
      data: updatedService,
    });
  } catch (error) {
    console.error(
      "Update Service Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update service.",
      error: `Update Service Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Delete Service -------- */
export async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const existingService = await Service.findById(id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    if (existingService.imagePublicId) {
      try {
        await deleteFromCloudinary(existingService.imagePublicId);
      } catch (error) {
        console.warn(
          "Failed to delete image from Cloudinary:",
          error?.message || error,
        );
      }
    }

    await existingService.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully!",
    });
  } catch (error) {
    console.error(
      "Delete Service Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete service.",
      error: `Delete Service Error: ${error?.stack || error?.message || error}`,
    });
  }
}
