// MediFlow / Server / routes / appointmentRouter.js
import express from "express";
import {
  confirmPayment,
  createAppointment,
  getAppointments,
  getAppointmentsByPatient,
} from "../controllers/appointmentController.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";

const appointmentRouter = express.Router();

appointmentRouter.get("/appointments-get", getAppointments);
appointmentRouter.get("/appointment-confirm-payment", confirmPayment);

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

export default appointmentRouter;
