const express = require("express");
const {
    createOrder,
    getMyOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
    getOrdersStats,
    updatePaymentStatus,
    deliverOrder
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
router.get("/stats", allowedTo("admin"), getOrdersStats);

router.get("/my-orders", getMyOrders);
router.get("/:id", idValidator, getOrder);

router.put("/:id/status", updateOrderValidator, allowedTo("admin"), updateOrderStatus);
router.put("/:id/cancel", idValidator, cancelOrder);

router.get("/", allowedTo("admin"), getAllOrders);
router.patch("/:id/payment",allowedTo("admin"), idValidator, updatePaymentStatus);

router.patch("/:id/deliver",allowedTo("admin"), idValidator, deliverOrder);

module.exports = router;