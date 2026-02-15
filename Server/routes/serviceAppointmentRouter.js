// MediFlow / Server / routes / serviceAppointmentRouter.js
import express from "express";
import {
  cancelServiceAppointment,
  confirmServiceAppointmentPayment,
  createServiceAppointment,
  getServiceAppointmentById,
  getServiceAppointments,
  getServiceAppointmentsByPatient,
  getServiceAppointmentStats,
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

serviceAppointmentRouter.get(
  "/serviceAppointment-get-stats/summary",
  getServiceAppointmentStats,
);

serviceAppointmentRouter.post(
  "/serviceAppointment-create",
  clerkMiddleware(),
  requireAuth(),
  createServiceAppointment,
);

serviceAppointmentRouter.get(
  "/serviceAppointment-get-by-patient",
  clerkMiddleware(),
  requireAuth(),
  getServiceAppointmentsByPatient,
);

serviceAppointmentRouter.get(
  "/serviceAppointment-get/:id",
  getServiceAppointmentById,
);

serviceAppointmentRouter.put(
  "/serviceAppointment-update/:id",
  updateServiceAppointment,
);

serviceAppointmentRouter.post(
  "/:id/serviceAppointment-cancel",
  cancelServiceAppointment,
);

export default serviceAppointmentRouter;
