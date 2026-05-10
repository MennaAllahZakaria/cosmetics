const express = require("express");

const {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    addImageToProduct,
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


router.post("/",protect, allowedTo("admin"), uploadImages , attachUploadedLinks ,createProductValidator, createProduct);

router.get ("/", getProducts);

router.get ("/:id" ,idValidator, getProduct);

router.put("/:id" ,protect, allowedTo("admin") , uploadImages , attachUploadedLinks,updateProductValidator , updateProduct);

router.patch("/:id/images",protect ,allowedTo("admin"), uploadImages , attachUploadedLinks, idValidator, addImageToProduct);

router.delete("/:id" ,protect,allowedTo("admin"), idValidator , deleteProduct);

module.exports = router;