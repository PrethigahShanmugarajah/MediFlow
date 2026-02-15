// MediFlow / Server / routes / doctorRouter.js
import express from "express";
import multer from "multer";
import {
  createDoctor,
  getDoctor,
  getDoctors,
} from "../controllers/doctorController.js";

const upload = multer({ dest: "/tmp" });

const doctorRouter = express.Router();

doctorRouter.get("/doctors-get", getDoctors);
doctorRouter.get("/doctor-get/:id", getDoctor);
doctorRouter.post("/doctor-create", upload.single("image"), createDoctor);

export default doctorRouter;
