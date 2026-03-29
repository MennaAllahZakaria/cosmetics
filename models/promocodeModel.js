const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        uppercase: true,
        unique: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: [0, "Discount percentage must be at least 0"],
        max: [100, "Discount percentage cannot exceed 100"],
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number,
        required: true,
        min: [1, "Usage limit must be at least 1"],
    },
    timesUsed: {
        type: Number,
        default: 0,
    },
    usedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    minOrderAmount: Number,
    isActive: Boolean,
}, {
    timestamps: true,
});

module.exports = mongoose.models.PromoCode || mongoose.model("PromoCode", promoCodeSchema);