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

    // Create token // calling on a method not a static
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
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

    // Create token // calling on a method not a static
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
});
