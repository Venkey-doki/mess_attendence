import express from "express";
import { markAttendance, getAttendanceStats,getWeeklyStats } from "../controllers/attendance.controller.js";

const router = express.Router();
router.post("/mark-attendance", markAttendance);
router.get("/attendance-stats", getAttendanceStats);
router.get("/weekly-stats", getWeeklyStats);

export default router;
