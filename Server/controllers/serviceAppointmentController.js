// MediFlow / Server / controllers / serviceAppointmentController.js
import Stripe from "stripe";
import {
  buildFrontendBase,
  parseTimeString,
  resolveClerkUserId,
  safeNumber,
} from "../utils/serviceAppointmentHelper.js";
import ServiceAppointment from "../models/ServiceAppointment.js";
import Service from "../models/Service.js";

const stripeKey = process.env.STRIPE_SECRET_KEY || null;
const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: "2022-11-15" })
  : null;

/* -------- Create Service Appointment -------- */
export async function createServiceAppointment(req, res) {
  try {
    const body = req.body || {};
    const clerkUserId = resolveClerkUserId(req);

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required to create a service appointment.",
      });
    }

    const {
      serviceId,
      serviceName: serviceNameFromBody,
      patientName,
      mobile,
      age,
      gender,
      date,
      time,
      hour,
      minute,
      ampm,
      paymentMethod = "Online",
      amount: amountFromBody,
      fees: feesFromBody,
      email,
      meta = {},
      notes = "",
      serviceImageUrl: serviceImageUrlFromBody,
      serviceImagePublicId: serviceImagePublicIdFromBody,
    } = body;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required",
      });
    }

    // if (!patientName || !String(patientName).trim()) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Patient name is required",
    //   });
    // }

    if (!patientName) {
      return res.status(400).json({
        success: false,
        message: "Patient name is required",
      });
    }

    if (!String(patientName).trim()) {
      return res.status(400).json({
        success: false,
        message: "Patient name cannot be empty",
      });
    }

    // if (!mobile || !String(mobile).trim()) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Mobile number is required",
    //   });
    // }

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    if (!String(mobile).trim()) {
      return res.status(400).json({
        success: false,
        message: "Mobile number cannot be empty",
      });
    }

    // if (!date || !String(date).trim()) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Date is required (YYYY-MM-DD)",
    //   });
    // }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    if (!String(date).trim()) {
      return res.status(400).json({
        success: false,
        message: "Date cannot be empty (YYYY-MM-DD)",
      });
    }

    const numericAmount = safeNumber(amountFromBody ?? feesFromBody ?? 0);
    // if (numericAmount === null || numericAmount < 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Amount or fees must be a valid number",
    //   });
    // }

    if (numericAmount === null) {
      return res.status(400).json({
        success: false,
        message: "Amount or fees is required and must be a number",
      });
    }

    if (numericAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Amount or fees cannot be negative",
      });
    }

    let finalHour = hour !== undefined ? safeNumber(hour) : null;
    let finalMinute = minute !== undefined ? safeNumber(minute) : null;
    let finalAmpm = ampm || null;

    // if (time && (finalHour === null || finalHour === undefined)) {
    //   const parsed = parseTimeString(time);
    //   if (!parsed) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Time string could not be parsed",
    //     });
    //   }

    //   finalHour = parsed.hour;
    //   finalMinute = parsed.minute;
    //   finalAmpm = parsed.ampm;
    // }

    if (time && finalHour === null) {
      const parsed = parseTimeString(time);
      if (!parsed) {
        return res.status(400).json({
          success: false,
          message:
            "Hour is missing and the provided time string could not be parsed",
        });
      }

      finalHour = parsed.hour;
      finalMinute = parsed.minute;
      finalAmpm = parsed.ampm;
    }

    if (time && finalHour === undefined) {
      const parsed = parseTimeString(time);
      if (!parsed) {
        return res.status(400).json({
          success: false,
          message:
            "Hour is undefined and the provided time string could not be parsed",
        });
      }

      finalHour = parsed.hour;
      finalMinute = parsed.minute;
      finalAmpm = parsed.ampm;
    }

    // if (
    //   finalHour === null ||
    //   finalMinute === null ||
    //   (finalAmpm !== "AM" && finalAmpm !== "PM")
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Time is missing or invalid — provide time string or hour, minute, and AM/PM.",
    //   });
    // }

    if (finalHour === null) {
      return res.status(400).json({
        success: false,
        message: "Hour is missing — provide a valid hour or time string.",
      });
    }

    if (finalMinute === null) {
      return res.status(400).json({
        success: false,
        message: "Minute is missing — provide a valid minute or time string.",
      });
    }

    if (finalAmpm !== "AM" && finalAmpm !== "PM") {
      return res.status(400).json({
        success: false,
        message: "AM/PM value is missing or invalid — provide AM or PM.",
      });
    }

    /* ---- Duplicate Booking Check ---- */
    try {
      const existing = await ServiceAppointment.findOne({
        serviceId: String(serviceId),
        createdBy: clerkUserId,
        date: String(date),
        hour: Number(finalHour),
        minute: Number(finalMinute),
        ampm: finalAmpm,
        status: { $ne: "Canceled" },
      }).lean();
      if (existing) {
        return res.status(409).json({
          success: false,
          message:
            "You already have a booking for this service on the selected date and time.",
        });
      }
    } catch (checkError) {
      console.warn("Duplicate booking check failed:", checkError);
    }

    /* ---- Fetch service snapshot (non-fatal) ---- */
    let svc = null;
    try {
      svc = await Service.findById(serviceId).lean();
    } catch (e) {
      console.warn("Service lookup failed:", e?.message || e);
    }

    let resolvedServiceName =
      serviceNameFromBody || (svc && (svc.name || svc.title)) || "Service";

    const svcImageUrlFromDB =
      svc &&
      (String(
        svc.imageUrl ||
          svc.image ||
          svc.image?.url ||
          svc.profileImage?.url ||
          "",
      ).trim() ||
        "");

    const svcImagePublicIdFromDB =
      svc &&
      (String(
        svc.imagePublicId ||
          svc.image?.publicId ||
          svc.profileImage?.publicId ||
          "",
      ).trim() ||
        "");

    const finalServiceImageUrl =
      svcImageUrlFromDB && svcImageUrlFromDB.length
        ? svcImageUrlFromDB
        : (serviceImageUrlFromBody && String(serviceImageUrlFromBody).trim()) ||
          "";

    const finalServiceImagePublicId =
      svcImagePublicIdFromDB && svcImagePublicIdFromDB.length
        ? svcImagePublicIdFromDB
        : (serviceImagePublicIdFromBody &&
            String(serviceImagePublicIdFromBody).trim()) ||
          "";

    const base = {
      serviceId,
      serviceName: resolvedServiceName,
      serviceImage: {
        url: finalServiceImageUrl,
        publicId: finalServiceImagePublicId,
      },
      patientName: String(patientName).trim(),
      mobile: String(mobile).trim(),
      age: age ? Number(age) : undefined,
      gender: gender || "",
      date: String(date),
      hour: Number(finalHour),
      minute: Number(finalMinute),
      ampm: finalAmpm,
      fees: numericAmount,
      createdBy: clerkUserId,
      notes: notes || "",
    };

    /* ---- Free appointment ---- */
    if (numericAmount === 0) {
      const created = await ServiceAppointment.create({
        ...base,
        status: "Pending",
        payment: {
          method: "Cash",
          status: "Pending",
          amount: 0,
          paidAt: new Date(),
        },
      });

      return res.status(201).json({
        success: true,
        message: "Free service appointment created successfully!",
        appointment: created,
      });
    }

    /* ---- Cash booking ---- */
    if (paymentMethod === "Cash") {
      const created = await ServiceAppointment.create({
        ...base,
        status: "Pending",
        payment: {
          method: "Cash",
          status: "Pending",
          amount: numericAmount,
          meta,
        },
      });

      return res.status(201).json({
        success: true,
        message:
          "Service appointment created successfully. Pay with cash at the hospital.",
        appointment: created,
        checkoutUrl: null,
      });
    }

    /* ---- Online booking (Stripe) ---- */
    if (!stripe)
      return res.status(500).json({
        success: false,
        message: "Stripe is not configured on the server",
      });

    const frontendBase = buildFrontendBase(req);
    if (!frontendBase)
      return res.status(500).json({
        success: false,
        message:
          "Frontend base URL not available. Set FRONTEND_URL environment variable or provide Origin header.",
      });

    const successUrl = `${frontendBase}/service-appointment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontendBase}/service-appointment/cancel`;

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: email ? String(email) : undefined,
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: `Service: ${String(resolvedServiceName).slice(0, 60)}`,
                description: `Appointment on ${base.date} ${base.hour}:${String(base.minute).padStart(2, "0")} ${base.ampm}`,
              },
              unit_amount: Math.round(numericAmount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          serviceId: String(serviceId),
          serviceName: String(resolvedServiceName).slice(0, 200),
          patientName: base.patientName,
          mobile: base.mobile,
          clerkUserId: base.createdBy || "",
          serviceImageUrl: finalServiceImageUrl
            ? String(finalServiceImageUrl).slice(0, 200)
            : "",
        },
      });
    } catch (stripeError) {
      console.error("Stripe create session error:", stripeError);
      const message =
        stripeError?.raw?.message || stripeError?.message || "Stripe error";
      return res.status(502).json({
        success: false,
        message: `Payment provider error: ${message}`,
      });
    }

    try {
      const created = await ServiceAppointment.create({
        ...base,
        status: "Confirmed",
        payment: {
          method: "Online",
          status: "Pending",
          amount: numericAmount,
          sessionId: session.id || "",
        },
      });

      return res.status(201).json({
        success: true,
        message:
          "Service appointment created successfully. Proceed to online payment.",
        appointment: created,
        checkoutUrl: session.url || null,
      });
    } catch (dbError) {
      console.error(
        "DB error saving service appointment after stripe session:",
        dbError,
      );

      return res.status(500).json({
        success: false,
        message: "Failed to create service appointment record",
      });
    }
  } catch (error) {
    console.error(
      "Create Service Appointment Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create service appointment.",
      error: `Create Service Appointment Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Confirm Service Appointment Payment -------- */
export async function confirmServiceAppointmentPayment(req, res) {
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
        message: "Stripe is not configured.",
      });
    }

    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch (error) {
      console.error("Stripe Error:", error);
      return res.status(404).json({
        success: false,
        message: "Stripe session not found.",
      });
    }

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Invalid Stripe session.",
      });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment has not been completed.",
      });
    }

    let appt = await ServiceAppointment.findOneAndUpdate(
      { "payment.sessionId": session_id },
      {
        $set: {
          "payment.status": "Confirmed",
          "payment.providerId": session.payment_intent || "",
          "payment.paidAt": new Date(),
          status: "Confirmed",
        },
      },
      { new: true },
    );

    if (!appt && session.metadata?.appointmentId) {
      appt = await ServiceAppointment.findOneAndUpdate(
        { _id: session.metadata.appointmentId },
        {
          $set: {
            "payment.status": "Confirmed",
            "payment.providerId": session.payment_intent || "",
            "payment.paidAt": new Date(),
            status: "Confirmed",
          },
        },
        { new: true },
      );
    }

    if (!appt)
      return res.status(404).json({
        success: false,
        message: "Service appointment not found.",
      });

    return res.json({
      success: true,
      message: "Service appointment payment confirmed successfully!",
      appointment: appt,
    });
  } catch (error) {
    console.error(
      "Confirm Service Appointment Payment Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to confirm service appointment payment.",
      error: `Confirm Service Appointment Payment Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Service Appointments -------- */
export async function getServiceAppointments(req, res) {
  try {
    const {
      serviceId,
      mobile,
      status,
      page: pageRaw = 1,
      limit: limitRaw = 50,
      search = "",
    } = req.query;
    const limit = Math.min(200, Math.max(1, parseInt(limitRaw, 10) || 50));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (serviceId) filter.serviceId = serviceId;
    if (mobile) filter.mobile = mobile;
    if (status) filter.status = status;
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ patientName: re }, { mobile: re }, { notes: re }];
    }

    const appointments = await ServiceAppointment.find(filter)
      .populate("serviceId", "name image imageUrl imageSmall")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ServiceAppointment.countDocuments(filter);

    if (!appointments) {
      return res.status(200).json({
        success: true,
        message: "No service appointments found.",
        appointments: [],
        meta: { page, limit, total: 0, count: 0 },
      });
    }

    if (appointments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No service appointments found.",
        appointments: [],
        meta: { page, limit, total: 0, count: 0 },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service appointments fetched successfully!",
      appointments,
      meta: { page, limit, total, count: appointments.length },
    });
  } catch (error) {
    console.error(
      "Get Service Appointments Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service appointments.",
      error: `Get Service Appointments Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Service Appointment By ID-------- */
export async function getServiceAppointmentById(req, res) {
  try {
    const { id } = req.params;
    const appt = await ServiceAppointment.findById(id).lean();

    if (!appt) {
      return res.status(404).json({
        success: false,
        message: "Service appointment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service appointment fetched successfully!",
      data: appt,
    });
  } catch (error) {
    console.error(
      "Get Service Appointment By ID Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service appointment.",
      error: `Get Service Appointment By ID Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Update Service Appointment -------- */
export async function updateServiceAppointment(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const updates = {};

    /* ---- First check wherther fill if yes then update the field ---- */
    if (body.status !== undefined) updates.status = body.status;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.payment !== undefined) updates.payment = body.payment;
    if (body["payment.status"] !== undefined)
      updates["payment.status"] = body["payment.status"];

    if (body.rescheduledTo) {
      const { date, time } = body.rescheduledTo || {};
      updates.rescheduledTo = {};
      if (date) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
          return res.status(400).json({
            success: false,
            message: "rescheduledTo.date must be in YYYY-MM-DD format",
          });
        updates.rescheduledTo.date = date;
        updates.date = date;
      }
      if (time) {
        updates.rescheduledTo.time = String(time);
        const parsed = parseTimeString(String(time));
        if (!parsed)
          return res.status(400).json({
            success: false,
            message: "rescheduledTo.time could not be parsed",
          });
        updates.hour = parsed.hour;
        updates.minute = parsed.minute;
        updates.ampm = parsed.ampm;
        updates.time = `${String(parsed.hour).padStart(2, "0")}:${String(parsed.minute).padStart(2, "0")} ${parsed.ampm}`;
      }
      if (!body.status) updates.status = "Rescheduled";
    }

    if (updates.payment) {
      const method = updates.payment.method || updates.payment?.method;
      if (method && String(method).toLowerCase() === "online")
        updates.status = updates.status || "Confirmed";
      if (updates.payment.status && updates.payment.status === "Confirmed") {
        updates.status = "Confirmed";
        if (updates.payment.paidAt === undefined)
          updates.payment.paidAt = new Date();
      }
    }

    const updated = await ServiceAppointment.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Service appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service appointment updated successfully!",
      data: updated,
    });
  } catch (error) {
    console.error(
      "Update Service Appointment Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update service appointment",
      error: `Update Service Appointment Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Cancel Service Appointment -------- */
export async function cancelServiceAppointment(req, res) {
  try {
    const { id } = req.params;
    const appt = await ServiceAppointment.findById(id);

    if (!appt) {
      return res.status(404).json({
        success: false,
        message: "Service appointment not found",
      });
    }

    if (appt.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed appointment",
      });
    }

    appt.status = "Canceled";
    if (appt.payment)
      appt.payment.status =
        appt.payment.status === "Confirmed" ? "Canceled" : "Pending";

    await appt.save();

    return res.json({
      success: true,
      message: "Service appointment canceled successfully!",
      data: appt,
    });
  } catch (error) {
    console.error(
      "Cancel Service Appointment Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to cancel service appointment",
      error: `Cancel Service Appointment Error: ${error?.stack || error?.message || error}`,
    });
  }
}

/* -------- Get Service Appointment Statistics -------- */
export async function getServiceAppointmentStats(req, res) {
  try {
    const services = await Service.aggregate([
      {
        $lookup: {
          from: "serviceappointments",
          localField: "_id",
          foreignField: "serviceId",
          as: "appointments",
        },
      },
      {
        $addFields: {
          totalAppointments: { $size: "$appointments" },
          completed: {
            $size: {
              $filter: {
                input: "$appointments",
                as: "a",
                cond: { $eq: ["$$a.status", "Completed"] },
              },
            },
          },
          canceled: {
            $size: {
              $filter: {
                input: "$appointments",
                as: "a",
                cond: { $eq: ["$$a.status", "Canceled"] },
              },
            },
          },
        },
      },
      { $addFields: { earning: { $multiply: ["$completed", "$price"] } } },
      {
        $project: {
          name: 1,
          price: 1,
          image: "$imageUrl",
          totalAppointments: 1,
          completed: 1,
          canceled: 1,
          earning: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Service appointment statistics fetched successfully!",
      services,
      totalServices: services.length,
    });
  } catch (error) {
    console.error(
      "Get Service Appointment Statistics Error:",
      error?.stack || error?.message || error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Service Appointment Statistics.",
      error: `Get Service Appointment Statistics Error: ${error?.stack || error?.message || error}`,
    });
  }
}
