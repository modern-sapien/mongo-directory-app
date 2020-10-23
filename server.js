const express = require("express");
const dotenv = require("dotenv");
// Morgan is a HTTP request middleware logger
const morgan = require("morgan");
const connectDB = require("./config/db")

// Load env variables
dotenv.config({path: "./config/config.env"})

// Connect to database
connectDB();

// Router Files
const bootcamps = require("./routes/bootcamps")

const app = express();

// Dev Logging Middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps)

// Creating a port that will either access an environmental variable PORT or port 5000
const PORT = process.env.PORT || 5000;
// Console logging the environment that the port is running on and its port #
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
