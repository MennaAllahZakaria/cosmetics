const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    address: {
        street :{
            type:String,
        },
        floor :{
            type:Number,
        },
        building :{
            type:String,
        },
        apartment :{
            type:String,
        },
        city :{
            type:String,
        },
        phone :{
            type:String,
        },
        
    },
    items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: {
                    type: String,
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
                    min: [0, "Price must be above 0"],
                },

            },
        ],
    
    paymentType :{
        type: String,
        enum: ["cash", "visa"],
        default: "cash",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
    },

    shipping :{
        type: Number,
        default: 0,
        min: [0, "shipping must be above 0"],
    },

    totalAmount :{
        type: Number,
    },

    discountCode :{
        type: String
    },

    isDelivered :{
        type: Boolean,
        default: false, 
    }, 
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    promoCode: {
        type: String,
    },


    
},{
    timestamps: true,
});

module.exports = mongoose.model("Order", orderSchema);