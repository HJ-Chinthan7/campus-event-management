
const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/studentController");
const {authenticateAdmin}  = require("../middleware/auth");


router.get("/", authenticateAdmin, studentController.getAllStudents);

router.get("/:studentId", authenticateAdmin, studentController.getStudentById);

router.put("/:studentId", authenticateAdmin, studentController.updateStudent);

router.delete("/:studentId", authenticateAdmin, studentController.deleteStudent);

module.exports = router;
