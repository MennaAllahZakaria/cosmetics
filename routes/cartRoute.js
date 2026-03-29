const express = require("express");

const {
    addToCart,
    removeFromCart,
    getMyCart
} = require("../services/cartService");

const {
    addToCartValidator,
    removeFromCartValidator
} = require("../utils/validators/cartValidator");

const { protect, allowedTo } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add", protect, allowedTo("user"), addToCartValidator, addToCart);
router.delete("/remove/:productId", protect, allowedTo("user"), removeFromCartValidator, removeFromCart);
router.get("/my-cart", protect, allowedTo("user"), getMyCart);

module.exports = router;