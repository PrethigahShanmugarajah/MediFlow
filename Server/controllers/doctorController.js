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
      message: "Doctor created successfully!",
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

/* -------- Get Doctors -------- */
export async function getDoctors(req, res) {
  try {
    const { q = "", limit: limitRaw = 200, page: pageRaw = 1 } = req.query;
    const limit = Math.min(500, Math.max(1, parseInt(limitRaw, 10) || 200));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const match = {};
    if (q && typeof q === "string" && q.trim()) {
      const re = new RegExp(q.trim(), "i");
      match.$or = [
        { name: re },
        { specialization: re },
        { speciality: re },
        { email: re },
      ];
    }

    const docs = await Doctor.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "appointments",
          localField: "_id",
          foreignField: "doctorId",
          as: "appointments",
        },
      },
      {
        $addFields: {
          appointmentsTotal: { $size: "$appointments" },
          appointmentsCompleted: {
            $size: {
              $filter: {
                input: "$appointments",
                as: "a",
                cond: { $in: ["$$a.status", ["Confirmed", "Completed"]] },
              },
            },
          },
          appointmentsCanceled: {
            $size: {
              $filter: {
                input: "$appointments",
                as: "a",
                cond: { $eq: ["$$a.status", "Canceled"] },
              },
            },
          },
          earnings: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$appointments",
                    as: "a",
                    cond: { $in: ["$$a.status", ["Confirmed", "Completed"]] },
                  },
                },
                as: "p",
                in: { $ifNull: ["$$p.fees", 0] },
              },
            },
          },
        },
      },
      { $project: { appointments: 0 } },
      { $sort: { name: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const normalized = docs.map((d) => ({
      _id: d._id,
      id: d._id,
      name: d.name || "",
      specialization: d.specialization || d.speciality || "",
      fee: d.fee ?? d.fees ?? d.consultationFee ?? 0,
      imageUrl: d.imageUrl || d.image || d.avatar || null,
      appointmentsTotal: d.appointmentsTotal || 0,
      appointmentsCompleted: d.appointmentsCompleted || 0,
      appointmentsCanceled: d.appointmentsCanceled || 0,
      earnings: d.earnings || 0,
      availability: d.availability ?? "Available",
      schedule: d.schedule && typeof d.schedule === "object" ? d.schedule : {},
      patients: d.patients ?? "",
      rating: d.rating ?? 0,
      about: d.about ?? "",
      experience: d.experience ?? "",
      qualifications: d.qualifications ?? "",
      location: d.location ?? "",
      success: d.success ?? "",
      raw: d,
    }));

    const total = await Doctor.countDocuments(match);

    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully!",
      data: normalized,
      doctors: normalized,
      meta: { page, limit, total },
    });
  } catch (error) {
    console.error("Get Doctors Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctors.",
      error: `Get Doctors Error: ${error.message}`,
    });
  }
}

/* -------- Get Doctor -------- */
export async function getDoctor(req, res) {
  try {
    const { id } = req.params;
    const doc = await Doctor.findById(id).select("-password").lean();
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor fetched successfully!",
      data: normalizeDocForClient(doc),
    });
  } catch (error) {
    console.error("Get Doctor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch doctor.",
      error: `Get Doctor Error: ${error}`,
    });
  }
}
