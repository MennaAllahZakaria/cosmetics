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

router.get ("/", getProducts);
router.get ("/:id" ,idValidator, getProduct);

router.use(protect );

router.post("/", allowedTo("admin"), uploadImages , attachUploadedLinks ,createProductValidator, createProduct);

router.put("/:id" , allowedTo("admin") , uploadImages , attachUploadedLinks,updateProductValidator , updateProduct);

router.patch("/:id/images" ,allowedTo("admin"), uploadImages , attachUploadedLinks, idValidator, addImageToProduct);

router.delete("/:id" ,allowedTo("admin"), idValidator , deleteProduct);

module.exports = router;