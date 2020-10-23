const mongoose = require("mongoose");

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please a name"],
        unique: true, 
        trim: true,
        maxlength: [50, "name cannot be more than 50 characters"]
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [500, "name cannot be more than 50 characters"]
    },
    website: {
        type: String,
        match:  [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please add a valid URL with HTTP or HTTPS"
        ]
    },
    phone: {
        type: String,
        maxlength: [20, "phone number cannot be longer than 20 characters"]
    },
    email: {
        type: String,
        maxlength: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, "Please add an address"]
    },
    location: {
        // GeoJSON point
        type: {String,
        enum: ["Point"],
        required: true  },

        coordinates: {
            type: [Number],
            required: true,
            index: "2dsphere"
        },
        formattedAddress: String,
        street: String,
        city: String,
        zipcode: String,
        country: String,
    },

})
