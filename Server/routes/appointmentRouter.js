import express from "express";
import {
  cancelAppointment,
  confirmPayment,
  createAppointment,
  getAppointments,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  getBookedSlotsByDoctor,
  getRegisteredUserCount,
  getStatus,
  updateAppointment,
} from "../controllers/appointmentController.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";

const appointmentRouter = express.Router();

appointmentRouter.get("/appointments-get", getAppointments);
appointmentRouter.get("/appointment-confirm-payment", confirmPayment);
appointmentRouter.get("/appointment-get-status/summary", getStatus);

appointmentRouter.post(
  "/appointment-create",
  clerkMiddleware(),
  requireAuth(),
  createAppointment,
);

appointmentRouter.get(
  "/appointment-get-by-patient",
  clerkMiddleware(),
  requireAuth(),
  getAppointmentsByPatient,
);

appointmentRouter.get(
  "/appointments-get-by-doctor/:doctorId",
  getAppointmentsByDoctor,
);

appointmentRouter.post("/:id/appointment-cancel", cancelAppointment);
appointmentRouter.get(
  "/appointment-get-registered-usercount",
  getRegisteredUserCount,
);

appointmentRouter.put("/appointment-update/:id", updateAppointment);

appointmentRouter.get(
  "/appointments-get-slots-bydoctor/:doctorId",
  getBookedSlotsByDoctor,
);

export default appointmentRouter;
