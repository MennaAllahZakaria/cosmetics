const express = require("express");
const {
    createOrder,
    getMyOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder
} = require("../services/orderService");

const {
    createOrderValidator,
    idValidator,
    updateOrderValidator
} = require("../utils/validators/orderValidator");

const { protect, allowedTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createOrderValidator, createOrder);

router.get("/my-orders", getMyOrders);
router.get("/:id", idValidator, getOrder);

router.put("/:id/status", updateOrderValidator, allowedTo("admin"), updateOrderStatus);
router.put("/:id/cancel", idValidator, cancelOrder);

module.exports = router;