// MediFlow / Server / routes / serviceAppointmentRouter.js
import express from "express";
import {
  confirmServiceAppointmentPayment,
  createServiceAppointment,
  getServiceAppointmentById,
  getServiceAppointments,
  updateServiceAppointment,
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

serviceAppointmentRouter.get(
  "/serviceAppointment-get/:id",
  getServiceAppointmentById,
);

serviceAppointmentRouter.put(
  "/serviceAppointment-update/:id",
  updateServiceAppointment,
);

export default serviceAppointmentRouter;
