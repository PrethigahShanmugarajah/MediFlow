// MediFlow / Server / controllers / appointmentController.js
import dotenv from "dotenv";
import Stripe from "stripe";
import Appointment from "../models/Appointment.js";
import {
  buildFrontendBase,
  resolveClerkUserId,
  safeNumber,
} from "../utils/appointmentHelper.js";
import Doctor from "../models/Doctor.js";
import { clerkClient } from "@clerk/express";

dotenv.config();

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const MAJOR_ADMIN_ID = process.env.MAJOR_ADMIN_ID || null;
const stripe = STRIPE_KEY
  ? new Stripe(STRIPE_KEY, { apiVersion: "2023-10-16" })
  : null;

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
      return res.status(200).json({
        success: true,
        message: "No appointments found.",
        appointments: [],
        meta: { page, limit, total: 0, count: 0 },
      });
    }

    if (items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No appointments found.",
        appointments: [],
        meta: { page, limit, total: 0, count: 0 },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully!",
      appointments: items,
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
      return res.status(200).json({
        success: true,
        message: "No appointments found.",
        appointments: [],
      });
    }

    if (appointments.length === 0) {
      return res.status(200).json({
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

/* -------- Create Appointment -------- */
export async function createAppointment(req, res) {
  try {
    const {
      doctorId,
      patientName,
      mobile,
      age = "",
      gender = "",
      date,
      time,
      fee,
      fees,
      notes = "",
      email,
      paymentMethod,
      owner: ownerFromBody = null,
      doctorName: doctorNameFromBody,
      speciality: specialityFromBody,
      doctorImageUrl: doctorImageUrlFromBody,
      doctorImagePublicId: doctorImagePublicIdFromBody,
    } = req.body || {};

    const clerkUserId = resolveClerkUserId(req);
    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    // if (!doctorId || !patientName || !mobile || !date || !time) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All fields are required.",
    //   });
    // }

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required.",
      });
    }

    if (!patientName) {
      return res.status(400).json({
        success: false,
        message: "Patient name is required.",
      });
    }

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required.",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Appointment date is required.",
      });
    }

    if (!time) {
      return res.status(400).json({
        success: false,
        message: "Appointment time is required.",
      });
    }

    const numericFee = safeNumber(fee ?? fees ?? 0);
    // if (numericFee === null || numericFee < 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Fee must be a valid number.",
    //   });
    // }

    if (numericFee === null) {
      return res.status(400).json({
        success: false,
        message: "Fee must be a number.",
      });
    }

    if (numericFee < 0) {
      return res.status(400).json({
        success: false,
        message: "Fee cannot be negative.",
      });
    }

    const existingBooking = await Appointment.findOne({
      doctorId,
      createdBy: clerkUserId,
      date: String(date),
      time: String(time),
      status: { $ne: "Cancelled" },
    }).lean();

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message:
          "You already have an appointment with this doctor at the selected slot.",
      });
    }

    let doctor = null;
    try {
      doctor = await Doctor.findById(doctorId).lean();
    } catch (error) {
      console.warn("Doctor lookup failed:", error?.message || error);
    }

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    let resolvedOwner = ownerFromBody || doctor.owner || null;
    if (!resolvedOwner) resolvedOwner = MAJOR_ADMIN_ID || String(doctorId);

    const doctorName =
      (doctor.name && String(doctor.name).trim()) ||
      (doctorNameFromBody && String(doctorNameFromBody).trim()) ||
      "";
    const speciality =
      (doctor.specialization && String(doctor.specialization).trim()) ||
      (doctor.speciality && String(doctor.speciality).trim()) ||
      (specialityFromBody && String(specialityFromBody).trim()) ||
      "";

    const doctorImageUrl =
      (doctor.imageUrl && String(doctor.imageUrl).trim()) ||
      (doctor.image && String(doctor.image).trim()) ||
      (doctor.avatarUrl && String(doctor.avatarUrl).trim()) ||
      (doctor.profileImage &&
        doctor.profileImage.url &&
        String(doctor.profileImage.url).trim()) ||
      (doctorImageUrlFromBody && String(doctorImageUrlFromBody).trim()) ||
      "";

    const doctorImagePublicId =
      (doctor.imagePublicId && String(doctor.imagePublicId).trim()) ||
      (doctor.profileImage &&
        doctor.profileImage.publicId &&
        String(doctor.profileImage.publicId).trim()) ||
      (doctorImagePublicIdFromBody &&
        String(doctorImagePublicIdFromBody).trim()) ||
      "";

    const doctorImage = { url: doctorImageUrl, publicId: doctorImagePublicId };

    const base = {
      doctorId: String(doctor._id || doctorId),
      doctorName,
      speciality,
      doctorImage,
      patientName: String(patientName).trim(),
      mobile: String(mobile).trim(),
      age: age ? Number(age) : undefined,
      gender: gender ? String(gender) : "",
      date: String(date),
      time: String(time),
      fees: numericFee,
      status: "Pending",
      payment: {
        method: paymentMethod === "Cash" ? "Cash" : "Online",
        status: "Pending",
        amount: numericFee,
      },
      notes: notes || "",
      createdBy: clerkUserId,
      owner: resolvedOwner,
      sessionId: null,
    };

    /* ---- Free appointment ---- */
    if (numericFee === 0) {
      const created = await Appointment.create({
        ...base,
        status: "Confirmed",
        payment: { method: base.payment.method, status: "Paid", amount: 0 },
        paidAt: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: "Free appointment created successfully!",
        appointment: created,
        checkoutUrl: null,
      });
    }

    /* ---- Cash payment ---- */
    if (paymentMethod === "Cash") {
      const created = await Appointment.create({
        ...base,
        status: "Pending",
        payment: { method: "Cash", status: "Pending", amount: numericFee },
      });

      return res.status(201).json({
        success: true,
        message:
          "Appointment created successfully. Pay with cash at the hospital.",
        appointment: created,
        checkoutUrl: null,
      });
    }

    /* ---- Online: Stripe ---- */
    if (!stripe)
      return res.status(500).json({
        success: false,
        message: "Stripe not configured on server",
      });

    const frontBase = buildFrontendBase(req);
    if (!frontBase) {
      return res.status(500).json({
        success: false,
        message:
          "Frontend URL could not be determined. Set FRONTEND_URL or send Origin header.",
      });
    }

    const successUrl = `${frontBase}/appointment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontBase}/appointment/cancel`;

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: email || undefined,
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `Appointment - ${String(patientName).slice(0, 40)}`,
              },
              unit_amount: Math.round(numericFee * 100),
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          doctorId: String(doctorId),
          doctorName: doctorName || "",
          speciality: speciality || "",
          patientName: base.patientName,
          mobile: base.mobile,
          clerkUserId: clerkUserId || "",
        },
      });
    } catch (stripeError) {
      console.error("Stripe create session error:", stripeError);
      const message =
        stripeError?.raw?.message || stripeError?.message || "Stripe error";

      return res.status(502).json({
        success: false,
        message: `Payment provider error: ${message}`,
        error: stripeError,
      });
    }

    try {
      const created = await Appointment.create({
        ...base,
        sessionId: session.id,
        payment: {
          ...base.payment,
          providerId: session.payment_intent || session.paymentIntent || null,
        },
        status: "Pending",
      });
      return res.status(201).json({
        success: true,
        message: "Appointment created successfully. Proceed to online payment.",
        appointment: created,
        checkoutUrl: session.url || null,
      });
    } catch (dbError) {
      console.error(
        "DB error saving appointment after stripe session:",
        dbError,
      );

      return res.status(500).json({
        success: false,
        message: "Failed to create appointment record",
      });
    }
  } catch (error) {
    console.error(
      "Create Appointment Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create appointments.",
      error: `Create Appointments Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Confirm Payment -------- */
export async function confirmPayment(req, res) {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required.",
      });
    }

    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: "Stripe is not configured on the server.",
      });
    }

    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch (error) {
      console.error("Stripe retrieve session error:", error);

      return res.status(404).json({
        success: false,
        message: "Stripe session not found.",
      });
    }

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Invalid session.",
      });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment has not been completed yet.",
      });
    }

    let appt = await Appointment.findOneAndUpdate(
      { sessionId: session_id },
      {
        "payment.status": "Paid",
        "payment.providerId":
          session.payment_intent || session.payment_intent_id || null,
        status: "Confirmed",
        paidAt: new Date(),
      },
      { new: true },
    );

    if (!appt) {
      const meta = session.metadata || {};
      if (meta.doctorId && meta.mobile && meta.patientName) {
        appt = await Appointment.findOneAndUpdate(
          {
            doctorId: meta.doctorId,
            mobile: meta.mobile,
            patientName: meta.patientName,
            fees: Math.round((session.amount_total || 0) / 100) || undefined,
          },
          {
            "payment.status": "Paid",
            "payment.providerId": session.payment_intent || null,
            status: "Confirmed",
            paidAt: new Date(),
            sessionId: session_id,
          },
          { new: true },
        );
      }
    }

    if (!appt) {
      const amount = Math.round((session.amount_total || 0) / 100);
      const fifteenAgo = new Date(Date.now() - 1000 * 60 * 15);
      appt = await Appointment.findOneAndUpdate(
        { fees: amount, createdAt: { $gte: fifteenAgo } },
        {
          "payment.status": "Paid",
          "payment.providerId": session.payment_intent || null,
          status: "Confirmed",
          paidAt: new Date(),
          sessionId: session_id,
        },
        { new: true },
      );
    }

    if (!appt) {
      return res.status(404).json({
        success: false,
        message: "No appointment found for this payment session.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment confirmed successfully!",
      appointment: appt,
    });
  } catch (error) {
    console.error(
      "Confirm Payment Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to confirm payment.",
      error: `Confirm Payment Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Update Appointment -------- */
export async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const appt = await Appointment.findById(id);

    if (!appt) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    const terminal = appt.status === "Completed" || appt.status === "Canceled";
    if (terminal && body.status && body.status !== appt.status) {
      return res.status(400).json({
        success: false,
        message: "Cannot change status of a completed/canceled appointment.",
      });
    }

    const update = {};
    if (body.status) update.status = body.status;
    if (body.notes !== undefined) update.notes = body.notes;

    if (body.date && body.time) {
      if (appt.status === "Completed" || appt.status === "Canceled") {
        return res.status(400).json({
          success: false,
          message: "Cannot reschedule a completed/canceled appointment.",
        });
      }
      update.date = body.date;
      update.time = body.time;
      update.status = "Rescheduled";
      update.rescheduledTo = { date: body.date, time: body.time };
    }

    const updated = await Appointment.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .populate({ path: "doctorId", select: "name imageUrl" })
      .lean();

    return res.json({
      success: true,
      message: "Appointment updated successfully!",
      appointment: updated,
    });
  } catch (error) {
    console.error(
      "Update Appointment Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update appointment.",
      error: `Update Appointment Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Cancel Appointment -------- */
export async function cancelAppointment(req, res) {
  try {
    const { id } = req.params;
    const appt = await Appointment.findById(id);

    if (!appt) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    appt.status = "Canceled";
    await appt.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully!",
      appointment: appt,
    });
  } catch (error) {
    console.error(
      "Cancel Appointment Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment.",
      error: `Cancel Appointment Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Status -------- */
export async function getStatus(req, res) {
  try {
    const total = await Appointment.countDocuments();

    if (total === null) {
      return res.status(200).json({
        success: true,
        message: "No appointments found.",
        stats: { total: 0, revenue: 0, recentLast7Days: 0 },
      });
    }

    if (total === undefined) {
      return res.status(200).json({
        success: true,
        message: "No appointments found.",
        stats: { total: 0, revenue: 0, recentLast7Days: 0 },
      });
    }

    if (total === 0) {
      return res.status(200).json({
        success: true,
        message: "No appointments found.",
        stats: { total: 0, revenue: 0, recentLast7Days: 0 },
      });
    }

    const paidAgg = await Appointment.aggregate([
      { $match: { "payment.status": "Paid" } },
      { $group: { _id: null, total: { $sum: "$fees" } } },
    ]);
    const revenue = (paidAgg[0] && paidAgg[0].total) || 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = await Appointment.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment statistics fetched successfully!",
      stats: { total, revenue, recentLast7Days: recent },
    });
  } catch (error) {
    console.error("Get Status Error:", error?.stack || error?.message || error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment statistics.",
      error: `Get Status Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Appointments By Doctor -------- */
export async function getAppointmentsByDoctor(req, res) {
  try {
    const { doctorId } = req.params;
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const {
      mobile,
      status,
      search = "",
      limit: limitRaw = 50,
      page: pageRaw = 1,
    } = req.query;
    const limit = Math.min(200, Math.max(1, parseInt(limitRaw, 10) || 50));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const filter = { doctorId };
    if (mobile) filter.mobile = mobile;
    if (status) filter.status = status;
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ patientName: re }, { mobile: re }, { notes: re }];
    }

    const items = await Appointment.find(filter)
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(limit)
      .populate("doctorId", "name specialization owner imageUrl image")
      .lean();

    const total = await Appointment.countDocuments(filter);

    if (total === null) {
      return res.status(200).json({
        success: true,
        message: "No appointments found.",
        appointments: [],
        meta: { page, limit, total: 0, count: 0 },
      });
    }

    if (total === 0) {
      return res.status(200).json({
        success: true,
        message: "No appointments found.",
        appointments: [],
        meta: { page, limit, total: 0, count: 0 },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully!",
      appointments: items,
      meta: { page, limit, total, count: items.length },
    });
  } catch (error) {
    console.error(
      "Get Appointments By Doctor Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments by Doctor.",
      error: `Get Appointments By Doctor Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Register User Count -------- */
export async function getRegisteredUserCount(req, res) {
  try {
    const totalUsers = await clerkClient.users.getCount();

    return res.status(200).json({
      success: true,
      message: "Registered users fetched successfully!",
      totalUsers,
    });
  } catch (error) {
    console.error(
      "Get Register User Count Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch registered users.",
      error: `Get Register User Count Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Booked Slots By Doctor + Date -------- */
export async function getBookedSlotsByDoctor(req, res) {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required.",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required (YYYY-MM-DD).",
      });
    }

    const items = await Appointment.find({
      doctorId: String(doctorId),
      date: String(date),
      status: { $nin: ["Cancelled", "Canceled"] },
    })
      .select("time status")
      .lean();

    const bookedSlots = (items || [])
      .map((a) => String(a.time || "").trim())
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      message: "Booked slots fetched successfully!",
      doctorId: String(doctorId),
      date: String(date),
      bookedSlots,
      count: bookedSlots.length,
    });
  } catch (error) {
    console.error(
      "Get Booked Slots Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch booked slots.",
      error: `Get Booked Slots Error: ${error?.stack || error?.message || error}`,
    });
  }
}
