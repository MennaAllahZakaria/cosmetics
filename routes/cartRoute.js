const express = require("express");

const {
    addToCart,
    removeFromCart,
    decreaseCartItem,
    getMyCart
} = require("../services/cartService");

const {
    addToCartValidator,
    removeFromCartValidator
} = require("../utils/validators/cartValidator");

const { protect, allowedTo ,identifyUser} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add", identifyUser,  identifyUser, addToCart);
router.delete("/remove/:productId", identifyUser,  identifyUser, removeFromCart);
router.patch("/decrease/:productId", identifyUser,  identifyUser, decreaseCartItem);
router.get("/my-cart", identifyUser,  getMyCart);

module.exports = router;