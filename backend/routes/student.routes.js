import express from "express";
import { verifyStudent } from "../controllers/student.controller.js";

const router = express.Router();

router.get("/verify-student/:rollNumber", verifyStudent);

export default router;
