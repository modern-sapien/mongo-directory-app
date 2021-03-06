const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // else if (req.cookies.token) {
  //     token = req.cookies.token
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route.", 401));
  }

  try {
    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // returns user id, when created and expiration
    console.log(decoded);

    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route.", 401));
  }
});

// Authorize // Grant access to specific roles
exports.authorize = (...roles) => {
  // run middleware
  return (req, res, next) => {
    // check if role has been included
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
