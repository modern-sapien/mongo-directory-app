const express = require("express");
const { getCourses, getCourse } = require("../controllers/courseController");

// mergeParams allows us to allow bootcamp.js router to send traffic
const router = express.Router({ mergeParams: true});

router.route("/").get(getCourses);
router.route("/:id").get(getCourse);

module.exports = router;
