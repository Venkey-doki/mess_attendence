import pool from "../DB/index.js";

export const getStudentByRoll = async (rollNumber) => {
  const result = await pool.query("SELECT * FROM students WHERE roll_number = $1", [rollNumber]);
  return result.rows[0];
};
