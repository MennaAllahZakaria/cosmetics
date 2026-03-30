const HandlerFactory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");

exports.createCategory = asyncHandler(async (req, res) => {
    if (req.uploadedFiles?.image) {
    req.body.image = req.uploadedFiles.image[0];
  }
  const category = await Category.create(req.body);
  res.status(201).json({ data: category });

});

exports.getCategory = HandlerFactory.getOne(Category);

exports.getCategories = HandlerFactory.getAll(Category);

exports.updateCategory = asyncHandler(async (req, res, next) => {
    if (req.uploadedFiles?.image) {
    req.body.image = req.uploadedFiles.image[0];
  }
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new ApiError("Category not found", 404));
  }

  res.status(200).json({ data: category });
});

exports.deleteCategory = HandlerFactory.deleteOne(Category);