const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name required"],
    },
    description: {  
        type: String,
        required: [true, "Product description required"],
    },
    price: {
        type: Number,
        required: [true, "Product price required"],
        min: [0, "Price cannot be negative"],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Product category required"],
    },  
    stock: {
        type: Number,
        required: [true, "Product stock required"],
        min: [0, "Stock cannot be negative"],
    },
    brand: String,

    isActive: {
        type: Boolean,
        default: true
    },

    skinType: {
        type: [String],
        enum: ["oily", "dry", "combination", "sensitive", "normal"],
        minlength: [1, "At least one skin type required"],
    },
    images: [String], // Array of image URLs
    ratingsAverage: {
        type: Number,
        default: 0,
        min: [0, "Rating must be above 0"],
        max: [5, "Rating must be below 5"],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
        min: [0, "Ratings quantity cannot be negative"],
    },
    isDeleted: Boolean,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);