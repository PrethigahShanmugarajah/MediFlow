// MediFlow / Server / routes / doctorRouter.js
import express from "express";
import multer from "multer";
import {
  createDoctor,
  deleteDoctor,
  getDoctor,
  getDoctors,
  updateDoctor,
} from "../controllers/doctorController.js";
import doctorAuth from "../middlewares/doctorAuth.js";

const upload = multer({ dest: "/tmp" });

const doctorRouter = express.Router();

doctorRouter.get("/doctors-get", getDoctors);
doctorRouter.get("/doctor-get/:id", getDoctor);
doctorRouter.post("/doctor-create", upload.single("image"), createDoctor);
doctorRouter.put(
  "/doctor-update/:id",
  doctorAuth,
  upload.single("image"),
  updateDoctor,
);
doctorRouter.delete("/doctor-delete/:id", deleteDoctor);

export default doctorRouter;
