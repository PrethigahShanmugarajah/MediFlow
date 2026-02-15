// MediFlow / Server / routes / appointmentRouter.js
import express from "express";
import {
  getAppointments,
  getAppointmentsByPatient,
} from "../controllers/appointmentController.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";

const appointmentRouter = express.Router();

appointmentRouter.get("/appointments-get", getAppointments);

appointmentRouter.get(
  "/appointment-get-by-patient",
  clerkMiddleware(),
  requireAuth(),
  getAppointmentsByPatient,
);

export default appointmentRouter;
