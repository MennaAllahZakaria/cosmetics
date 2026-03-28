const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name required"],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Category description required"],
    },
    image: {
        type: String, // URL of the category image
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Category", categorySchema);