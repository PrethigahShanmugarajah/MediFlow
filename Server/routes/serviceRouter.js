// MediFlow / Server / routes / serviceRouter.js
import express from "express";
import multer from "multer";
import {
  createService,
  getServiceById,
  getServices,
} from "../controllers/serviceController.js";

const upload = multer({ dest: "/tmp" });

const serviceRouter = express.Router();

serviceRouter.get("/services-get", getServices);
serviceRouter.get("/service-get/:id", getServiceById);
serviceRouter.post("/service-create", upload.single("image"), createService);

export default serviceRouter;
