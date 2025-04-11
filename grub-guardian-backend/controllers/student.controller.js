import { getStudentByRoll } from "../models/student.models.js";

const verifyStudent = async (req, res) => {
  const { rollNumber } = req.params;

  if (!rollNumber) {
    return res.status(400).json({ message: "rollNumber is required" });
  }

  try {
    const student = await getStudentByRoll(rollNumber);

    return res.status(200).json({ exists: !!student }); // true if found, false otherwise
  } catch (error) {
    console.error("Error verifying student:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { verifyStudent };