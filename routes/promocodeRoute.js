const express = require("express");

const {
    createPromoCode,
    applyPromoCode,
    getAllPromoCodes

} =  require("../services/promocodeService");

const {createPromoCodeValidator} = require("../utils/validators/promocodeValidator");

const router = express.Router();

const { protect, allowedTo } = require("../middleware/authMiddleware");

router.post("/create", protect, allowedTo("admin"), createPromoCodeValidator, createPromoCode);
router.post("/apply", protect, applyPromoCode);
router.get("/all", protect, allowedTo("admin"), getAllPromoCodes);

module.exports = router;
