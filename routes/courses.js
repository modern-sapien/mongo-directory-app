const express = require("express");

const { getCourses } = require("../controllers/courseController");
// mergeParams allows us to allow bootcamp.js router to send traffic
const router = express.Router({ mergeParams: true});

router.route("/").get(getCourses);

module.exports = router;
