const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createCategoryValidator = [

    check("name")
        .notEmpty()
        .withMessage("name is required")
        .isLength({ min: 2 })
        .withMessage("name must be at least 2 characters"),

    check("description")
        .notEmpty()
        .withMessage("description is required")
        .isLength({ min: 2 })
        .withMessage("description must be at least 2 characters")
        .isLength({ max: 200})
        .withMessage("description must be at most 200 characters"),

    validatorMiddleware,

];

exports.idValidator = [
    check("id")
            .notEmpty()
            .withMessage("id required")
            .isMongoId()
            .withMessage("Invalid id format"),
    validatorMiddleware
];

exports.updateCategoryValidator = [

    check("id")
        .notEmpty()
        .withMessage("id required")
        .isMongoId()
        .withMessage("Invalid id format"),
    
    check("name")
        .optional()
        .withMessage("name is required")
        .isLength({ min: 2 })
        .withMessage("name must be at least 2 characters"),

    check("description")
        .optional()
        .withMessage("description is required")
        .isLength({ min: 2 })
        .withMessage("description must be at least 2 characters")
        .isLength({ max: 200})
        .withMessage("description must be at most 200 characters"),

    validatorMiddleware,

]