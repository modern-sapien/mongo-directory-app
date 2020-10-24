const express = require("express");
const dotenv = require("dotenv");
// Morgan is a HTTP request middleware logger
const colors = require("colors");
const morgan = require("morgan");
const errorHandler = require("./middleware/error")
const connectDB = require("./config/db")

// Load env variables
dotenv.config({path: "./config/config.env"})

const app = express();

// Body Parser
app.use(express.json());

// Connect to database
connectDB();

// Router Files
const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")

// Dev Logging Middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps)
app.use("/api/v1/courses", courses)

// Custom error handler has to be brought in after routers run
app.use(errorHandler)

// Creating a port that will either access an environmental variable PORT or port 5000
const PORT = process.env.PORT || 5000;
// Console logging the environment that the port is running on and its port #
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));


// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) =>  {
    console.log(`Error: ${err.message}`.red)
    // Close server & exit process
    // server.close(() => process.exit(1))
})