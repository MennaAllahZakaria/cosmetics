const HandlerFactory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

exports.createProduct = asyncHandler(async (req, res) => {
    if (req.files?.images) {
    req.body.images = req.uploadedFiles?.images || [];
  }
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });

});

exports.getProduct = HandlerFactory.getOne(Product);

exports.getProducts = HandlerFactory.getAll(Product);

exports.updateProduct = HandlerFactory.updateOne(Product);

exports.deleteProduct = HandlerFactory.deleteOne(Product);