import pool from "../DB/index.js";
import { extractYearFromRoll } from "../utils/roll.utils.js";
import { Readable } from "stream";
import { format } from "@fast-csv/format";

export const generateReport = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ success: false, message: "Date is required" });
  }

  try {
    const currentYear = new Date().getFullYear();

    // Get all students
    const { rows: students } = await pool.query("SELECT id, roll_number FROM students");

    // Get attendance for the given date
    const { rows: attendance } = await pool.query(`
      SELECT a.*, s.roll_number
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE DATE(a.timestamp) = $1
    `, [date]);

    // Prepare maps and data
    const yearStats = { 1: { total: 0, present: 0 }, 2: { total: 0, present: 0 }, 3: { total: 0, present: 0 }, 4: { total: 0, present: 0 } };
    const meals = {
      lunch: { present: 0, veg: 0, nonVeg: 0 },
      dinner: { present: 0, veg: 0, nonVeg: 0 }
    };
    const rollMap = {};
    const presentRollsByYear = { 1: [], 2: [], 3: [], 4: [] };

    // Map students to years
    students.forEach(s => {
      const year = extractYearFromRoll(s.roll_number, currentYear);
      rollMap[s.id] = { rollNumber: s.roll_number, year };
      if (yearStats[year]) yearStats[year].total++;
    });

    // Analyze attendance
    attendance.forEach(a => {
      const { student_id, meal_type, food_preference } = a;
      const { rollNumber, year } = rollMap[student_id];
      if (!yearStats[year]) return;

      yearStats[year].present++;
      if (!presentRollsByYear[year].includes(rollNumber)) {
        presentRollsByYear[year].push(rollNumber);
      }

      const meal = meal_type.toLowerCase();
      const pref = (food_preference || "").toLowerCase();
      if (meals[meal]) {
        meals[meal].present++;
        if (pref === "veg") meals[meal].veg++;
        else if (pref === "non-veg") meals[meal].nonVeg++;
      }
    });

    const totalStudents = students.length;
    const totalPresent = attendance.length;
    const totalAbsent = totalStudents - totalPresent;

    // Construct CSV rows
    const rows = [
      ["Date", date],
      ["Total Students", totalStudents],
      ["Present", totalPresent],
      ["Absent", totalAbsent],
      [],
      ["Year", "Total", "Present", "Absent"],
      ...Object.entries(yearStats).map(([year, stat]) => [year, stat.total, stat.present, stat.total - stat.present]),
      [],
      ["Meal", "Total", "Present", "Absent", "Veg", "NonVeg"],
      ...Object.entries(meals).map(([meal, stat]) => [
        meal.charAt(0).toUpperCase() + meal.slice(1),
        totalStudents,
        stat.present,
        totalStudents - stat.present,
        stat.veg,
        stat.nonVeg
      ]),
      [],
      ["Present Students (Grouped by Year)"]
    ];

    Object.entries(presentRollsByYear).forEach(([year, rollNumbers]) => {
      rows.push([`Year ${year}`]);
      rollNumbers.forEach(roll => rows.push([roll]));
      rows.push([]); // Empty line between years
    });

    // Stream CSV
    const csvStream = format({ headers: false });
    const chunks = [];

    csvStream.on("data", chunk => chunks.push(chunk));
    csvStream.on("end", () => {
      const csvBuffer = Buffer.concat(chunks);
      const encoded = encodeURIComponent(csvBuffer.toString("utf-8"));
      res.json({
        success: true,
        message: "Report generated successfully",
        reportUrl: `data:text/csv;charset=utf-8,${encoded}`
      });
    });

    const readable = Readable.from(rows);
    readable.pipe(csvStream);

  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
