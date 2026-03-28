const express = require("express");

const {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview


} = require("../services/reviewService");

const { protect, allowedTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createReview);
router.get("/product/:productId", getProductReviews);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
