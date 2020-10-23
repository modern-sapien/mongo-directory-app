const express = require("express");
const router = express.Router();

// get all bootcamps
router.get("/", (req, res) =>  {
    //send or json express informs headers what we are sending
    res.status(200).json({success: true, msg: "Show all bootcamps"})
});


// get individal bootcamp
router.get("/:id", (req, res) =>  {
    res.status(200).json({success: true, msg: `Get bootcamp ${req.params.id}`})
});
// create a bootcamp
router.post("/", (req, res) =>  {
    res.status(200).json({success: true, msg: `Create new bootcamp`})
});
// update a bootcamp
router.put("/:id", (req, res) =>  {
    res.status(200).json({success: true, msg: `Update bootcamp ${req.params.id}`})
});
// delete a bootcamp
router.delete("/:id", (req, res) =>  {
    res.status(200).json({success: true, msg: `Delete a bootcamp ${req.params.id}`})
});

// exporting router to be used with server.js
module.exports = router;