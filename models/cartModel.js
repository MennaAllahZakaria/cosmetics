const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    guestId: {
        type: String,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, "Quantity must be at least 1"],
            },
            price: {
                type: Number,
                required: true,
                min: [0, "Price must be positive"],
            },
            
        },
    ],

    totalPrice:{
        type:Number,
    }
    
}, {
    timestamps: true,
});

cartSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { user: { $exists: true } } }
);

cartSchema.index(
  { guestId: 1 },
  { unique: true, partialFilterExpression: { guestId: { $exists: true } } }
);

module.exports = mongoose.model("Cart", cartSchema);