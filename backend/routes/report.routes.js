import express from "express";
import { generateReport } from "../controllers/report.controller.js";

const router = express.Router();

router.get("/generate-report", generateReport);

export default router;
