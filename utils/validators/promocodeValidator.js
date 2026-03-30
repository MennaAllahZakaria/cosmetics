const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createPromoCodeValidator = [
  check("code")
        .notEmpty()
        .withMessage("Promo code is required")
        .isAlphanumeric()
        .withMessage("Promo code must be alphanumeric")
        .isLength({ min: 3, max: 20 })
        .withMessage("Promo code must be between 3 and 20 characters"),
  check("discountPercentage")
        .notEmpty()
        .withMessage("Discount percentage is required")
        .isFloat({ min: 0, max: 100 })
        .withMessage("Discount percentage must be between 0 and 100"),
  check("expirationDate")
        .notEmpty()
        .withMessage("Expiration date is required")
        .isISO8601()
        .withMessage("Expiration date must be a valid date"),
    check("usageLimit")
        .notEmpty()
        .withMessage("Usage limit is required")
        .isInt({ min: 1 })
        .withMessage("Usage limit must be at least 1"),
  validatorMiddleware,
];


exports.idValidator = [
    check("id")
            .notEmpty()
            .withMessage("id required")   
            .isMongoId()
            .withMessage("Invalid id format"),
      validatorMiddleware,    
];