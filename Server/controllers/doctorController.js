// MediFlow / Server / controllers / doctorController.js
import Doctor from "../models/Doctor.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {
  normalizeDocForClient,
  parseScheduleInput,
} from "../utils/doctorHelper.js";
import jwt from "jsonwebtoken";

/* -------- Create Doctor -------- */
export async function createDoctor(req, res) {
  try {
    const body = req.body || {};
    // if (!body.email || !body.password || !body.name) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Name, email, and password are required.",
    //   });
    // }

    if (!body.name) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!body.email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!body.password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    const emailLC = (body.email || "").toLowerCase();
    if (await Doctor.findOne({ email: emailLC })) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use.",
      });
    }

    let imageUrl = body.imageUrl || null;
    let imagePublicId = body.imagePublished || null;
    if (req.file?.path) {
      const uploaded = await uploadToCloudinary(req.file.path, "doctors");
      imageUrl = uploaded?.secure_url || uploaded?.url || imageUrl;
      imagePublicId =
        uploaded?.public_id || uploaded?.publicId || imagePublicId;
    }

    const schedule = parseScheduleInput(body.schedule);

    const doc = new Doctor({
      email: emailLC,
      password: body.password,
      name: body.name,
      specialization: body.specialization || "",
      imageUrl,
      imagePublicId,
      availability: body.availability || "Available",
      experience: body.experience || "",
      qualifications: body.qualifications || "",
      location: body.location || "",
      about: body.about || "",
      fee: body.fee !== undefined ? Number(body.fee) : 0,
      schedule,
      success: body.success || "",
      patients: body.patients || "",
      rating: body.rating !== undefined ? Number(body.rating) : 0,
    });

    await doc.save();
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.warn("JWT Secret is not define");
      return res.status(500).json({
        success: false,
        message: "Server Misconfigured",
      });
    }

    const token = jwt.sign(
      {
        id: doc._id.toString(),
        email: doc.email,
        role: "doctor",
      },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    const newDoctor = normalizeDocForClient(doc.toObject());
    delete newDoctor.password;

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully.",
      data: newDoctor,
      token,
    });
  } catch (error) {
    console.error("Create Doctor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create doctor.",
      error: `Create Doctor Error: ${error.message}`,
    });
  }
}
