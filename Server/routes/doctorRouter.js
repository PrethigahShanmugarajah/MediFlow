// MediFlow / Server / routes / doctorRouter.js
import express from "express";
import multer from "multer";
import { createDoctor } from "../controllers/doctorController.js";

const upload = multer({ dest: "/tmp" });

const doctorRouter = express.Router();

doctorRouter.post("/doctor-create", upload.single("image"), createDoctor);

export default doctorRouter;
