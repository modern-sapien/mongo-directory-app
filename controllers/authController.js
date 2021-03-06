const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body
    // Create user // Hashing password afterward and keeping controllers clean
    const user = await User.create({
        name, 
        email,
        password,
        role
    });
    // Creating a cookie with a token in it
    sendTokenResponse(user, 200, res);
});

// @desc    login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password} = req.body

    // Validate email & password
    if(!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400))
    }

    // Check for user // Model instance includes pasword 
    const user = await User.findOne({ email }).select("+password");
    if(!user)   {
        // 401 unauthorized
        return next(new ErrorResponse("Invalid credentials", 401))
    }
    // Check if password matches
    // Awaits bcrypt compare function, while entering in the sign in password from a user
    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401))
    }

    // Creating a cookie with a token in it
        sendTokenResponse(user, 200, res);
});

// @desc    GET current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc    FORGOT password
// @route   GET /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPass = asyncHandler(async (req, res, next) => {
    // matching user to req.body.email
    const user = await User.findOne({ email: req.body.email});

    if (!user) {
        return next(new ErrorResponse(`There is no user with that email`, 404))
    }

    // get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false})

    console.log(resetToken)

    res.status(200).json({
        success: true,
        data: user
    })
})


// Helper function
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        // sets and expiration 30 days from time of cookie creation
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    // When we are in production secure flag is on cookie.
    if (process.env.NODE_ENV === "production" ) {
        options.secure = true;
    }
    res
    .status(statusCode)
    .cookie("token", token, options)
    .json({success: true, token})
}