const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv")

// load environmental variables
dotenv.config({path: "./config/config.env"});

// load models
const Bootcamp = require("./models/Bootcamp");

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf8")
);

// import DB
const importData = async()  =>  {
    try{
        await Bootcamp.create(bootcamps)

        console.log("Seed data imported...".green.inverse)
    }catch (err){
        console.error(err);
    }
}

// Delete Data
const deleteData = async()  =>  {
    try{
        await Bootcamp.deleteMany()

        console.log("Seed data destroyed...".red.inverse)
        process.exit();
    }catch (err){
        console.error(err);
    }
}

// Importing or Deleting Seed Data
if(process.argv[2] === "-i") {
    importData(); 
} else if (process.argv[2] === "-d") {
    deleteData();
}
