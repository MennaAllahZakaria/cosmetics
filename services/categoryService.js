const HandlerFactory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");

exports.createCategory = asyncHandler(async (req, res) => {
    if (req.files?.image) {
    req.body.image = req.imageUrl;
  }
  const category = await Category.create(req.body);
  res.status(201).json({ data: category });

});

exports.getCategory = HandlerFactory.getOne(Category);

exports.getCategories = HandlerFactory.getAll(Category);

exports.updateCategory = HandlerFactory.updateOne(Category);

exports.deleteCategory = HandlerFactory.deleteOne(Category);