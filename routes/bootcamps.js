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

// Include other resource routers for directing traffic
const courseRouter = require("./courses")

const router = express.Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter)

router
    .route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/:id/photo").put(bootcampPhotoUpload);

router
    .route("/")
    .get(getBootcamps)
    .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

// exporting router to be used with server.js
module.exports = router;
