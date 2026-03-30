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

const {uploadImages, attachUploadedLinks} = require("../middleware/uploadImageMiddleware");
const router = express.Router();

router.use(protect );

router.post("/",allowedTo("admin") , uploadImages , attachUploadedLinks ,createCategoryValidator , createCategory);

router.get ("/", getCategories);

router.get ("/:id" ,idValidator, getCategory);

router.put("/:id" ,allowedTo("admin"), uploadImages , attachUploadedLinks , updateCategoryValidator, updateCategory);

router.delete("/:id" ,allowedTo("admin"), idValidator, deleteCategory);

module.exports = router;