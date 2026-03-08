import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function doctorAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Authorization header is missing.",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Bearer token is missing or malformed.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role && payload.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. The user is not a doctor.",
      });
    }

    const doctor = await Doctor.findById(payload.id).select("-password");
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    console.error("Doctor Authentication Error:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Doctor authentication failed.",
      error: `Doctor Authentication Error: ${error.message}`,
    });
  }
}
