const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");


exports.toggleFavoriteValidator =[
    check("productId")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid Product ID format"),
    validatorMiddleware,

]