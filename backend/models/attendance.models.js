import pool from "../DB/index.js";

export const insertAttendance = async (studentId, mealType, foodPreference, timestamp) => {
  await pool.query(
    "INSERT INTO attendance (student_id, meal_type, food_preference, timestamp) VALUES ($1, $2, $3, $4)",
    [studentId, mealType, foodPreference, timestamp]
  );
};
