// MediFlow / Server / routes / appointmentRouter.js
import express from "express";
import { getAppointments } from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

appointmentRouter.get("/appointments-get", getAppointments);

export default appointmentRouter;
