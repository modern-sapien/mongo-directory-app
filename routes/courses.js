const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse
} = require("../controllers/courseController");
const { update } = require("../models/Course");

// mergeParams allows us to allow bootcamp.js router to send traffic
const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses).post(addCourse);
router.route("/:id").get(getCourse).put(updateCourse);

module.exports = router;
