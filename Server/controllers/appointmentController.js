// MediFlow / Server / controllers / appointmentController.js
import dotenv from "dotenv";
import Appointment from "../models/Appointment.js";

dotenv.config();

/* -------- Get Appointments -------- */
export async function getAppointments(req, res) {
  try {
    const {
      doctorId,
      mobile,
      status,
      search = "",
      limit: limitRaw = 50,
      page: pageRaw = 1,
      patientClerkId,
      createdBy,
    } = req.query;
    const limit = Math.min(200, Math.max(1, parseInt(limitRaw, 10) || 50));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (doctorId) filter.doctorId = doctorId;
    if (mobile) filter.mobile = mobile;
    if (status) filter.status = status;
    if (patientClerkId) filter.createdBy = patientClerkId;
    if (createdBy) filter.createdBy = createdBy;
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ patientName: re }, { mobile: re }, { notes: re }];
    }

    const items = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("doctorId", "name specialization owner imageUrl image")
      .lean();

    const totalAppointments = await Appointment.countDocuments(filter);

    if (!items) {
      return res.status(404).json({
        success: true,
        message: "No appointments found.",
        appointments: [],
        meta: { page, limit, total: 0, count: 0 },
      });
    }

    if (items.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No appointments found.",
        appointments: [],
        meta: { page, limit, total: 0, count: 0 },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully!",
      appointments: totalAppointments,
      meta: { page, limit, total: totalAppointments, count: items.length },
    });
  } catch (error) {
    console.error(
      "Get Appointments Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments.",
      error: `Get Appointments Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Appointments By Patient -------- */
export async function getAppointmentsByPatient(req, res) {
  try {
    const queryCreatedBy = req.query.createdBy || null;
    const clearkUserId = req.auth?.userId || null;
    const resolvedCreatedBy = queryCreatedBy || clearkUserId || null;

    console.log(
      "resolvedCreatedBy(query or req.auth.userId):",
      resolvedCreatedBy,
    );

    if (!resolvedCreatedBy && !req.query.mobile) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const filter = {};
    if (resolvedCreatedBy) filter.createdBy = resolvedCreatedBy;
    if (req.query.mobile) filter.mobile = req.query.mobile;

    const appointments = await Appointment.find(filter)
      .sort({ date: 1, time: 1 })
      .lean();

    if (!appointments) {
      return res.status(404).json({
        success: true,
        message: "No appointments found.",
        appointments: [],
      });
    }

    if (appointments.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No appointments found.",
        appointments: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully!",
      appointments,
    });
  } catch (error) {
    console.error(
      "Get Appointments By Patient Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments by Patient.",
      error: `Get Appointments By Patient Error: ${error?.stack || error?.message || error}`,
    });
  }
}
