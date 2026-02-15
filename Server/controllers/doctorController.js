// MediFlow / Server / controllers / doctorController.js
import Doctor from "../models/Doctor.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";
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
      error: `Get Doctor Error: ${error.message}`,
    });
  }
}

/* -------- Update Doctor -------- */
export async function updateDoctor(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};

    // if (!req.doctor || String(req.doctor._id || req.doctor.id) !== String(id)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Not authorized to update this doctor.",
    //   });
    // }

    if (!req.doctor) {
      return res.status(403).json({
        success: false,
        message: "Doctor information is missing in the request.",
      });
    }

    if (String(req.doctor._id || req.doctor.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this doctor.",
      });
    }

    const existing = await Doctor.findById(id);
    if (!existing)
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });

    if (req.file?.path) {
      const uploaded = await uploadToCloudinary(req.file.path, "doctors");
      if (uploaded) {
        const previousPublicId = existing.imagePublicId;
        existing.imageUrl =
          uploaded.secure_url || uploaded.url || existing.imageUrl;
        existing.imagePublicId =
          uploaded.public_id || uploaded.publicId || existing.imagePublicId;
        if (previousPublicId && previousPublicId !== existing.imagePublicId) {
          deleteFromCloudinary(previousPublicId).catch((e) =>
            console.warn("deleteFromCloudinary warning:", e?.message || e),
          );
        }
      }
    } else if (body.imageUrl) {
      existing.imageUrl = body.imageUrl;
    }

    if (body.schedule) existing.schedule = parseScheduleInput(body.schedule);

    const updatable = [
      "name",
      "specialization",
      "experience",
      "qualifications",
      "location",
      "about",
      "fee",
      "availability",
      "success",
      "patients",
      "rating",
    ];
    updatable.forEach((k) => {
      if (body[k] !== undefined) existing[k] = body[k];
    });

    if (body.email && body.email !== existing.email) {
      const other = await Doctor.findOne({ email: body.email.toLowerCase() });
      if (other && other._id.toString() !== id)
        return res.status(409).json({
          success: false,
          message: "Email is already in use.",
        });
      existing.email = body.email.toLowerCase();
    }

    if (body.password) existing.password = body.password;

    await existing.save();

    const updateDoctor = normalizeDocForClient(existing.toObject());
    delete updateDoctor.password;

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully.",
      data: updateDoctor,
    });
  } catch (error) {
    console.error("Update Doctor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update doctor.",
      error: `Update Doctor Error: ${error.message}`,
    });
  }
}

/* -------- Delete Doctor -------- */
export async function deleteDoctor(req, res) {
  try {
    const { id } = req.params;
    const existing = await Doctor.findById(id);
    if (!existing) {
      return res.status(404).json({
        message: false,
        message: "Doctor not found.",
      });
    }

    if (existing.imagePublicId) {
      try {
        await deleteFromCloudinary(existing.imagePublicId);
      } catch (error) {
        console.warn("Delete From Cloudinary warning:", error.message || error);
      }
    }

    await Doctor.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Doctor removed successfully!",
    });
  } catch (error) {
    console.error("Delete Doctor Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete doctor.",
      error: `Delete Doctor Error: ${error.message}`,
    });
  }
}

/* -------- Toggle Availability -------- */
export async function toggleAvailability(req, res) {
  try {
    const { id } = req.params;

    // if (!req.doctor || String(req.doctor._id || req.doctor.id) !== String(id)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Not authorized to toggle availability of this doctor.",
    //   });
    // }

    if (!req.doctor) {
      return res.status(403).json({
        success: false,
        message: "Doctor information is missing in the request.",
      });
    }

    if (String(req.doctor._id || req.doctor.id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to toggle availability of this doctor.",
      });
    }

    const doc = await Doctor.findById(id);
    if (!doc) {
      return res.status(404).json({
        message: false,
        message: "Doctor not found.",
      });
    }

    if (typeof doc.availability === "boolean")
      doc.availability = !doc.availability;
    else
      doc.availability =
        doc.availability === "Available" ? "Unavailable" : "Available";

    await doc.save();
    const toggleDoctor = normalizeDocForClient(doc.toObject());
    delete toggleDoctor.password;

    return res.status(200).json({
      success: true,
      message: `Doctor availability changed to ${doc.availability}.`,
      data: toggleDoctor,
    });
  } catch (error) {
    console.error("Toggle Availability Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to toggle doctor availability.",
      error: `Toggle Availability Error: ${error.message}`,
    });
  }
}

/* -------- Doctor Login -------- */
export async function doctorLogin(req, res) {
  try {
    const { email, password } = req.body || {};
    // if (!email || !password) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Email and password are required.",
    //   });
    // }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    const doc = await Doctor.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!doc) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (doc.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Server misconfigured: JWT secret not defined.",
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

    const loginDoctor = doc.toObject();
    delete loginDoctor.password;

    return res.status(200).json({
      success: true,
      message: `${doc.name} logged in successfully!`,
      token,
      data: loginDoctor,
    });
  } catch (error) {
    console.error("Doctor Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to login doctor.",
      error: `Doctor Login Error: ${error.message}`,
    });
  }
}
