const express = require("express");
const router = express.Router();

// get all bootcamps
router.get("/api/v1/bootcamps", (req, res) =>  {
    //send or json express informs headers what we are sending
    res.status(200).json({success: true, msg: "Show all bootcamps"})
});
// individal bootcamp
router.get("/api/v1/bootcamps/:id", (req, res) =>  {
    res.status(200).json({success: true, msg: `Get bootcamp ${req.params.id}`})
});
// create a bootcamp
router.post("/api/v1/bootcamps", (req, res) =>  {
    res.status(200).json({success: true, msg: `Create new bootcamp`})
});
// update a bootcamp
router.put("/api/v1/bootcamps/:id", (req, res) =>  {
    res.status(200).json({success: true, msg: `Update bootcamp ${req.params.id}`})
});
// delete a bootcamp
router.delete("/api/v1/bootcamps/:id", (req, res) =>  {
    res.status(200).json({success: true, msg: `Delete a bootcamp ${req.params.id}`})
});