const express = require("express");
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcampController");

const router = express.Router();

router
    .route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

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
