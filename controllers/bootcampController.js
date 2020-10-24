const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder")
const asyncHandler = require("../middleware/async");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    // console.log(req.query);
    let query;
    
    // copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ["select", "sort", "limit", "page"];

    // Loop over removeFields & delete them from req query
    removeFields.forEach(param => delete reqQuery[param])
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // when querying with > or < add a $ before the match in the query string
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    
    // Finding resource 
    query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

    // If using select, only selected fields ?select=_____,____ will be returned
    if(req.query.select)    {
        const fields = req.query.select.split(",").join(" ")
        query = query.select(fields)
    }

    // Sort
    if(req.query.sort)  {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy)
    }   else {
        query = query.sort("-createdAt")
    }

    // Pagination 
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // countDocuments, mongoose method to camp all documents
    const total = await Bootcamp.countDocuments()

    query = query.skip(startIndex).limit(limit);

    // Executing query 
    const bootcamps = await query;
    
    // Pagination result
    const pagination = {}
    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page -1,
            limit
        }
    }
    res
      .status(200)
      .json({
        success: true,
        count: bootcamps.length,
        pagination,
        data: bootcamps,
      });

});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp)  {
            return next
            (new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({ success: true, data: bootcamp})

});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    // 201 status because we are creating something
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp)  {
        return next
        (new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({success: true, data: bootcamp})

});

// @desc    Delete bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if (!bootcamp)  {
            return next
            (new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json({success: true, data: {}})

        bootcamp.remove();
});

// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lgn from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi
    const radius = distance / 3963
    
    const bootcamps = await Bootcamp.find({ 
        location: {$geoWithin: { $centerSphere: [[ lng, lat ], radius ] } }
    })
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps  
    })
});


// @desc    Upload Photo for Bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    
    if (!bootcamp)  {
        return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
    
    if(!req.files)  {
        return next(new ErrorResponse(`Please upload a file`, 400))        
    }
    // sends back a file object
    console.log(req.files)
    const file = req.files.file

    // Make sure the image is a photo
    if(!file.mimetype.startsWith('image'))   {
      return  next(new ErrorResponse(`Please upload an image file`, 400)) 
    }

    console.log(bootcamp)
});