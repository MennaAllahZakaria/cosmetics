const express = require("express");

const {
    createPromoCode,
    applyPromoCode,
    getAllPromoCodes,
    getPromoCode,
    deletePromoCode

} =  require("../services/promocodeService");

const {createPromoCodeValidator, idValidator} = require("../utils/validators/promocodeValidator");

const router = express.Router();

const { protect, allowedTo } = require("../middleware/authMiddleware");

router.post("/create", protect, allowedTo("admin"), createPromoCodeValidator, createPromoCode);
router.post("/apply", protect, applyPromoCode);
router.get("/all", protect, allowedTo("admin"), getAllPromoCodes);
router.get("/:id", protect, allowedTo("admin"),idValidator, getPromoCode);
router.delete("/:id", protect, allowedTo("admin"),idValidator, deletePromoCode);

module.exports = router;
