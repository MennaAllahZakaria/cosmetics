const HandlerFactory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

exports.createProduct = asyncHandler(async (req, res) => {
    if (req.uploadedFiles?.images) {
    req.body.images = req.uploadedFiles?.images || [];
  }
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });

});

exports.getProduct = HandlerFactory.getOne(Product);

exports.getProducts = HandlerFactory.getAll(Product);

exports.updateProduct = asyncHandler(async (req, res, next) => {
    if (req.uploadedFiles?.images) {
    req.body.images = req.uploadedFiles?.images || [];
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new ApiError("Product not found", 404));
  }
  res.status(200).json({ data: product });
});

exports.addImageToProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!req.uploadedFiles?.images) {
        return next(new ApiError("No images uploaded", 400));
    }
    const product = await Product.findById(id);
    if (!product) {
        return next(new ApiError("Product not found", 404));
    }
    const newImages = req.uploadedFiles.images;
    product.images.push(...newImages);
    await product.save();
    res.status(200).json({ data: product });
});

exports.deleteProduct = HandlerFactory.deleteOne(Product);