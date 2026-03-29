const express = require("express");

const {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
} = require("../services/productService");

const {
    createProductValidator,
    idValidator,
    updateProductValidator
} = require("../utils/validators/productValidator");

const { protect, allowedTo } = require("../middleware/authMiddleware");

const {uploadImages, attachUploadedLinks} = require("../middleware/uploadImageMiddleware");
const router = express.Router();

router.use(protect , allowedTo("admin"));

router.post("/", uploadImages , attachUploadedLinks ,createProductValidator, createProduct);

router.get ("/", getProducts);

router.get ("/:id" ,idValidator, getProduct);

router.put("/:id" ,updateProductValidator , updateProduct);

router.delete("/:id" ,idValidator , deleteProduct);

module.exports = router;