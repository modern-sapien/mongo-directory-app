const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults)
  }
});

// @desc    Get a single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  // if course ID not found
  if (!course) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Add a course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  // manually assigned bootcamp in course model to the param ID provided by a user
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  // searches for bootcamp to see if we can add it to the "bootcamp" field in course model
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  // if course ID not found
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`),
      404
    );
  }

  // Make sure user is bootcamp owner
  // if user is not the owner and not an admin
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to this bootcamp ${bootcamp._id}`,
        401
      ));
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Update a course
// @route   POST /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  // if course ID not found
  if (!course) {
    return next(
      new ErrorResponse(`No bootcamp with id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is course owner
  // if user is not the owner and not an admin
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update a course to this bootcamp ${course._id}`,
        401
      ));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Delete a course
// @route   Delete /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  // if course ID not found
  if (!course) {
    return next(
      new ErrorResponse(`No bootcamp with id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is course owner
  // if user is not the owner and not an admin
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete a course to this bootcamp ${course._id}`,
        401
      ));
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
