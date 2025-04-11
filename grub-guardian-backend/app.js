import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import attendanceRoutes from "./routes/attendance.routes.js";
import studentRoutes from "./routes/student.routes.js";
import reportRoutes from "./routes/report.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/attendance", attendanceRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/report", reportRoutes);

export default app;
