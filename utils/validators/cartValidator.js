const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.addToCartValidator = [
  check("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID format"),
    check("quantity")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer"),
  validatorMiddleware,
];

exports.removeFromCartValidator = [
  check("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID format"),
  validatorMiddleware,
];

