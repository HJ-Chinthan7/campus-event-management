const express = require('express');
const userController = require('../Controllers/userController');
const {body}= require('express-validator');
const router = express.Router();



router.post('/student/register',[body("email").isEmail().notEmpty().withMessage("Invalid Email"),
    body("password").isLength({min: 8}).notEmpty().withMessage("Password must be at least 8 characters long"),
    body("name").notEmpty().withMessage(" Name is required"),
    body("phone").notEmpty().withMessage("Phone Number is required"),
    body("studentId").notEmpty().withMessage("Student ID is required"),
    body("year").notEmpty().withMessage("Year is required"),
    body("department").notEmpty().withMessage("Department is required"),
    body("collegeId").notEmpty().withMessage("College ID is required")
],userController.registerStudent);

router.post('/student/login',[body("email").isEmail().notEmpty().withMessage("Invalid Email"),
    body("password").isLength({min: 8}).notEmpty().withMessage("Password must be at least 8 characters long")]
    ,userController.loginStudent);

router.post('/admin/login',[body("email").isEmail().notEmpty().withMessage("Invalid Email"),
    body("password").isLength({min: 8}).notEmpty().withMessage("Password must be at least 8 characters long")],userController.adminLogin);

module.exports = router;
