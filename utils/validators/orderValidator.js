const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createOrderValidator = [
    check("address")
        .notEmpty()
        .withMessage("Address is required"),
    check("address.street")
        .notEmpty()
        .withMessage("Street is required"),
    check("address.floor")
        .isNumeric()
        .withMessage("Floor must be a number"),
    check("address.city")
        .notEmpty()
        .withMessage("City is required"),
    check("address.phone")
        .notEmpty()
        .withMessage("Phone is required"),
  validatorMiddleware,
];

exports.idValidator = [
  check("id")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid order ID format"),
  validatorMiddleware,
];

exports.updateOrderValidator = [
  check("id")
        .notEmpty()
        .withMessage("Order ID is required")
        .isMongoId()
        .withMessage("Invalid order ID format"),
    check("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["pending", "confirmed", "shipped", "delivered", "cancelled"])
        .withMessage("Invalid status value"),
  validatorMiddleware,
];