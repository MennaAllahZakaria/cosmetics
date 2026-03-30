const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createProductValidator = [

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
    
    check("price")  
        .notEmpty()
        .withMessage("price required")
        .isFloat({ gt: 0 })
        .withMessage("price must be a positive number"),

    check("category")
        .notEmpty()
        .withMessage("id required")
        .isMongoId()
        .withMessage("Invalid id format"),

    check("stock")  
        .notEmpty()
        .withMessage("stock required")
        .isFloat({ gt: 0 })
        .withMessage("stock must be a positive number"),
    
    check("skinType")
        .notEmpty()
        .withMessage("skinType required")
        .isLength({ min: 1 })
        .withMessage("At least one skin type required")
        .isIn(["oily", "dry", "combination", "sensitive", "normal"])
        .withMessage("Invalid skinType"),

    check("ratingsAverage")
        .isLength({ min: 0 })
        .withMessage("Rating must be above 0")
        .isLength({ max: 5})
        .withMessage("Rating must be below 5"),


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

exports.updateProductValidator = [

    check("id")
        .notEmpty()
        .withMessage("id required")
        .isMongoId()
        .withMessage("Invalid id format"),
    
    check("name")
        .optional()
        .isLength({ min: 2 })
        .withMessage("name must be at least 2 characters"),

    check("description")
        .optional()
        .isLength({ min: 2 })
        .withMessage("description must be at least 2 characters")
        .isLength({ max: 200})
        .withMessage("description must be at most 200 characters"),
    
    check("price")  
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("price must be a positive number"),

    check("category")
        .optional()
        .isMongoId()
        .withMessage("Invalid id format"),

    check("stock")  
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("stock must be a positive number"),
    
    check("skinType")
        .optional()
        .isIn(["oily", "dry", "combination", "sensitive", "normal"])
        .withMessage("Invalid skinType"),

    check("ratingsAverage")
         .optional()
        .isLength({ min: 0 })
        .withMessage("Rating must be above 0")
        .isLength({ max: 5})
        .withMessage("Rating must be below 5"),

    validatorMiddleware,

]