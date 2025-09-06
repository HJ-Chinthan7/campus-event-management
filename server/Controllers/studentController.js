const database = require("../database/database");


module.exports.getAllStudents = async (req, res) => {
  try {
    const students = await database.all(
      "SELECT id, student_id, name, email, phone, department, year FROM students WHERE college_id = ?",
      [req.user.college_id]
    );

    res.json(students);
  } catch (error) {
    console.error("Get all students error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports.getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await database.get(
      "SELECT id, student_id, name, email, phone, department, year FROM students WHERE id = ? AND college_id = ?",
      [studentId, req.user.college_id]
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports.updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { name, phone, department, year } = req.body;

 
    const result = await database.run(
      `
      UPDATE students
      SET name = ?, phone = ?, department = ?, year = ?
      WHERE id = ? AND college_id = ?
      `,
      [name,  phone, department, year, studentId, req.user.college_id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Student not found or no changes made" });
    }

    res.json({ message: "Student updated successfully" });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports.deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await database.run(
      "DELETE FROM students WHERE id = ? AND college_id = ?",
      [studentId, req.user.college_id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
