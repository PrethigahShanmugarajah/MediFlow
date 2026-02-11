// MediFlow / Server / server.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./config/db.js";

/* -------- INITIALIZE EXPRESS -------- */
const app = express();

/* -------- CONNECT TO DATABASE -------- */
connectDB();

/* -------- MIDDLEWARE CONFIGURATION -------- */
app.use(cors());
app.use(clerkMiddleware());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

/* -------- ROUTES -------- */
app.get("/", (req, res) => res.send("API is Working!"));

/* -------- PORT -------- */
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
