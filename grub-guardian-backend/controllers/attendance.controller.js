import { getStudentByRoll } from "../models/student.models.js";
import pool from "../DB/index.js";
import { insertAttendance } from "../models/attendance.models.js";
import { extractYearFromRoll } from "../utils/roll.Utils.js";
import dayjs from "dayjs";
import { io } from "../server.js";

const markAttendance = async (req, res) => {
  const { rollNumber, mealType, foodPreference } = req.body;

  if (!rollNumber || !mealType || !foodPreference) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const student = await getStudentByRoll(rollNumber);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const timestamp = new Date().toISOString();
    await insertAttendance(student.id, mealType, foodPreference, timestamp);

    const academicYear = extractYearFromRoll(rollNumber);

    // Emit real-time update
    io.emit("attendanceMarked", {
      rollNumber,
      mealType,
      foodPreference,
      name: student.name,
      timestamp,
    });

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      student: {
        rollNumber,
        name: student.name,
        year: academicYear,
        mealMarked: mealType,
        foodPreference,
        timestamp,
      }
    });
  } catch (err) {
    console.error("Error marking attendance:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAttendanceStats = async (req, res) => {
  const { date, mealType } = req.query;
  console.log("Received date:", date, "and mealType:", mealType);
  

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  try {
    // 1. Fetch all students
    const { rows: students } = await pool.query("SELECT id, roll_number FROM students");

    // 2. Fetch attendance records for the given date (+ optional mealType)
    let query = `
      SELECT student_id, meal_type, food_preference, timestamp
      FROM attendance
      WHERE DATE(timestamp) = $1
    `;
    const params = [date];

    if (mealType) {
      query += " AND meal_type = $2";
      params.push(mealType);
    }

    const { rows: attendance } = await pool.query(query, params);

    // 3. Map attendance to student_id
    const attendanceMap = {};
    attendance.forEach(entry => {
      if (!attendanceMap[entry.student_id]) {
        attendanceMap[entry.student_id] = [];
      }
      attendanceMap[entry.student_id].push(entry);
    });

    // 4. Initialize stats structure
    const stats = {
      total: students.length,
      present: 0,
      absent: 0,
      byYear: {
        1: { total: 0, present: 0, absent: 0 },
        2: { total: 0, present: 0, absent: 0 },
        3: { total: 0, present: 0, absent: 0 },
        4: { total: 0, present: 0, absent: 0 }
      },
      byMeal: {
        lunch: { total: 0, present: 0, absent: 0, veg: 0, nonVeg: 0 },
        dinner: { total: 0, present: 0, absent: 0, veg: 0, nonVeg: 0 }
      }
    };

    const currentYear = new Date().getFullYear();

    for (const student of students) {
      const year = extractYearFromRoll(student.roll_number, currentYear);
      if (year >= 1 && year <= 4) {
        stats.byYear[year].total += 1;
      }

      const isPresent = !!attendanceMap[student.id];
      if (isPresent) {
        stats.present += 1;
        if (year >= 1 && year <= 4) stats.byYear[year].present += 1;

        for (const entry of attendanceMap[student.id]) {
          const meal = entry.meal_type?.toLowerCase();
          const food = entry.food_preference?.toLowerCase();

          if (["lunch", "dinner"].includes(meal)) {
            stats.byMeal[meal].total += 1;
            stats.byMeal[meal].present += 1;
            if (food === "veg") stats.byMeal[meal].veg += 1;
            else if (food === "non-veg") stats.byMeal[meal].nonVeg += 1;
          }
        }
      } else {
        stats.absent += 1;
        if (year >= 1 && year <= 4) stats.byYear[year].absent += 1;
      }
    }

    // 5. Compute absent per meal
    for (const meal of ["lunch", "dinner"]) {
      stats.byMeal[meal].absent = stats.total - stats.byMeal[meal].present;
    }

    return res.json(stats);
  } catch (err) {
    console.error("Error fetching attendance stats:", err.message, err.stack);
    return res.status(500).json({ message: "Server error" });
  }
};

const getWeeklyStats = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "startDate and endDate are required" });
  }

  try {
    // 1. Build array of date strings between startDate and endDate
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const dates = [];

    for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, "day")) {
      dates.push(d.format("YYYY-MM-DD"));
    }

    // 2. Query all attendance in date range
    const { rows } = await pool.query(`
      SELECT 
        DATE(timestamp) as date,
        meal_type,
        food_preference
      FROM attendance
      WHERE DATE(timestamp) BETWEEN $1 AND $2
    `, [startDate, endDate]);

    // 3. Initialize stats map
    const stats = {
      dates,
      attendance: { lunch: [], dinner: [] },
      preferences: { veg: [], nonVeg: [] }
    };

    for (const date of dates) {
      const dayData = rows.filter(row => row.date === date);

      const lunch = dayData.filter(d => d.meal_type.toLowerCase() === "lunch");
      const dinner = dayData.filter(d => d.meal_type.toLowerCase() === "dinner");
      const veg = dayData.filter(d => d.food_preference.toLowerCase() === "veg");
      const nonVeg = dayData.filter(d => d.food_preference.toLowerCase() === "non-veg");

      stats.attendance.lunch.push(lunch.length);
      stats.attendance.dinner.push(dinner.length);
      stats.preferences.veg.push(veg.length);
      stats.preferences.nonVeg.push(nonVeg.length);
    }

    return res.json(stats);

  } catch (err) {
    console.error("Error fetching weekly stats:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export { markAttendance, getAttendanceStats, getWeeklyStats };