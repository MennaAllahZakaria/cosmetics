const HandlerFactory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

exports.createProduct = asyncHandler(async (req, res) => {
    if (req.uploadedFiles?.images) {
    req.body.images = req.uploadedFiles?.images || [];
  }
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });

});

exports.getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate("category", "name")
        .populate("createdBy", "name email");

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
        });
    }

    res.status(200).json({
        data: product,
    });
});

exports.getProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // products
    const products = await Product.find({
        isDeleted: { $ne: true },
    })
        .populate("category", "name")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit);

    // calculate sold quantities
    const soldProducts = await Order.aggregate([
        {
            $match: {
                status: {
                    $in: ["confirmed", "shipped", "delivered"],
                },
            },
        },

        {
            $unwind: "$items",
        },

        {
            $group: {
                _id: "$items.product",
                totalSold: {
                    $sum: "$items.quantity",
                },
            },
        },
    ]);

    // convert to map for fast lookup
    const soldMap = {};

    soldProducts.forEach((item) => {
        soldMap[item._id.toString()] = item.totalSold;
    });

    const formattedProducts = products.map((product) => {
        const createdAt = new Date(product.createdAt);
        const now = new Date();

        const diffInDays =
            (now - createdAt) / (1000 * 60 * 60 * 24);

        const soldCount =
            soldMap[product._id.toString()] || 0;

        return {
            ...product.toObject(),

            soldCount,

            badges: {
                bestSeller: soldCount >= 50,
                recentlyAdded: diffInDays <= 7,
            },
        };
    });

    const totalProducts = await Product.countDocuments({
        isDeleted: { $ne: true },
    });

    res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        results: formattedProducts.length,
        data: formattedProducts,
    });
});

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