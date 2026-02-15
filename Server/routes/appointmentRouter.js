// MediFlow / Server / routes / appointmentRouter.js
import express from "express";
import {
  cancelAppointment,
  confirmPayment,
  createAppointment,
  getAppointments,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
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

appointmentRouter.put("/appointment-update/:id", updateAppointment);

export default appointmentRouter;
