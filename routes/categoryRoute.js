const express = require("express");

const {
    createCategory,
    getCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require("../services/categoryService");

const {
    createCategoryValidator,
    idValidator,
    updateCategoryValidator
} = require("../utils/validators/categoryValidator");

const { protect, allowedTo } = require("../middleware/authMiddleware");

const {uploadImages, attachUploadedLinks} = require("../middleware/uploadFileMiddleware");
const router = express.Router();

router.use(protect , allowedTo("admin"));

router.post("/", uploadImages , attachUploadedLinks ,createCategoryValidator , createCategory);

router.get ("/", getCategories);

router.get ("/:id" ,idValidator, getCategory);

router.put("/:id" ,updateCategoryValidator, updateCategory);

router.delete("/:id" ,idValidator, deleteCategory);

module.exports = router;