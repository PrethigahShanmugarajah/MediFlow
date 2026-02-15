// MediFlow / Server / routes / serviceRouter.js
import express from "express";
import multer from "multer";
import { createService } from "../controllers/serviceController.js";

const upload = multer({ dest: "/tmp" });

const serviceRouter = express.Router();

serviceRouter.post("/service-create", upload.single("image"), createService);

export default serviceRouter;
