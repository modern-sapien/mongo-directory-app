const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");

const Course = require("../models/Course")
const advancedResults = require("../middleware/advancedResults");

// mergeParams allows us to allow bootcamp.js router to send traffic
const router = express.Router({ mergeParams: true });

// Brining in user auth to protect routes
const { protect } = require("../middleware/auth")

router.route("/")
    .get(advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }), getCourses)
    .post(protect, addCourse);

router.route("/:id")
    .get(getCourse)
    .put(protect, updateCourse)
    .delete(protect, deleteCourse);

module.exports = router;
