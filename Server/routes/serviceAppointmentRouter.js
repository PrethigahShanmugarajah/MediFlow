// MediFlow / Server / routes / serviceAppointmentRouter.js
import express from "express";
import { createServiceAppointment } from "../controllers/serviceAppointmentController.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";

const serviceAppointmentRouter = express.Router();

serviceAppointmentRouter.post(
  "/serviceAppointment-create",
  clerkMiddleware(),
  requireAuth(),
  createServiceAppointment,
);

export default serviceAppointmentRouter;
