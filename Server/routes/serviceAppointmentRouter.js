// MediFlow / Server / routes / serviceAppointmentRouter.js
import express from "express";
import {
  confirmServiceAppointmentPayment,
  createServiceAppointment,
  getServiceAppointments,
} from "../controllers/serviceAppointmentController.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";

const serviceAppointmentRouter = express.Router();

serviceAppointmentRouter.get(
  "/serviceAppointments-get",
  getServiceAppointments,
);

serviceAppointmentRouter.get(
  "/serviceAppointment-confirm-payment",
  confirmServiceAppointmentPayment,
);

serviceAppointmentRouter.post(
  "/serviceAppointment-create",
  clerkMiddleware(),
  requireAuth(),
  createServiceAppointment,
);

export default serviceAppointmentRouter;
