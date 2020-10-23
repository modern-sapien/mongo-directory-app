const express = require("express");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({path: "./config/config.env"})

const app = express();

// get all bootcamps
app.get("/api/v1/bootcamps", (req, res) =>  {
    //send or json express informs headers what we are sending
    res.status(200).json({success: true, msg: "Show all bootcamps"})
});
// individal bootcamp
app.get("/api/v1/bootcamps/:id", (req, res) =>  {
    res.status(200).json({success: true, msg: `Get bootcamp ${req.params.id}`})
});
// create a bootcamp
app.post("/api/v1/bootcamps", (req, res) =>  {
    res.status(200).json({success: true, msg: `Create new bootcamp`})
});
// update a bootcamp
app.put("/api/v1/bootcamps/:id", (req, res) =>  {
    res.status(200).json({success: true, msg: `Update bootcamp ${req.params.id}`})
});
// delete a bootcamp
app.delete("/api/v1/bootcamps/:id", (req, res) =>  {
    res.status(200).json({success: true, msg: `Delete a bootcamp ${req.params.id}`})
});

// Creating a port that will either access an environmental variable PORT or port 5000
const PORT = process.env.PORT || 5000;
// Console logging the environment that the port is running on and its port #
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
