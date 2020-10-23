// @desc    Logs request to console
const logger = (req, res, next) =>  {
    // creating a variable on our request object we can access anywhere
    // req.hello = "hello world";
    // custom logging middleware
    console.log(`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`);
    next();
}

module.exports = logger;