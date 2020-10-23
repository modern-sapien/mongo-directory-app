const ErrorResponse = require("../utils/errorResponse")
const Bootcamp = require("../models/Bootcamp");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
  try{
    const bootcamps = await Bootcamp.find();
    if (!bootcamps)  {
        res.status(400).json({success: false})
    }
    
    res.status(200).json({ success:true, count: bootcamps.length, data: bootcamps})
  } catch (err) {
    res.status(400).json({success: false, message: "Could not find bootcamps"})
  }
};

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp)  {
            // not formatted object ID
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({ success: true, data: bootcamp})
    } catch (err)   {
            // formatted object ID
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
};

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    // 201 status because we are creating something
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
      // bad request
      res.status(400).json({ success: false })
  }
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
  try { 
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp)  {
        return res.status(400).json({ success: false})
    }
    res.status(200).json({success: true, data: bootcamp})
  } catch (err) {
    res.status(400).json({ success: false, message: err})
  }

};

// @desc    Delete bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
    try { 
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if (!bootcamp)  {
            return res.status(400).json({ success: false})
        }
        res.status(200).json({success: true, data: {}})
    } catch (err) {
        res.status(400).json({ success: false, message: err})
      }
};
