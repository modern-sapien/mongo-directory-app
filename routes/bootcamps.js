const express = require("express");
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require("../controllers/bootcampController");

// brings in bootcamp model and advancedResults middleware

const Bootcamp = require("../models/Bootcamp")
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers for directing traffic
const courseRouter = require("./courses")

const router = express.Router();

const { protect } = require("../middleware/auth")

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter)

router
    .route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/:id/photo").put(protect, bootcampPhotoUpload);

router
    .route("/")
    .get(advancedResults(Bootcamp, "courses"), getBootcamps)
    .post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

// exporting router to be used with server.js
module.exports = router;
