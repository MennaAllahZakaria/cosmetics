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

    const matchStage = {
        isDeleted: { $ne: true },
    };

    // search by product name
    if (req.query.name) {
        matchStage.name = {
            $regex: req.query.name,
            $options: "i",
        };
    }

    // filter by skin type
    if (req.query.skinType) {
        matchStage.skinType = req.query.skinType;
    }

    // filter by price
    if (req.query.minPrice || req.query.maxPrice) {
        matchStage.price = {};

        if (req.query.minPrice) {
            matchStage.price.$gte = Number(req.query.minPrice);
        }

        if (req.query.maxPrice) {
            matchStage.price.$lte = Number(req.query.maxPrice);
        }
    }

    const products = await Product.aggregate([
        {
            $match: matchStage,
        },

        // join categories
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        },

        {
            $unwind: "$category",
        },

        // search by category name
        ...(req.query.category
            ? [
                  {
                      $match: {
                          "category.name": {
                              $regex: req.query.category,
                              $options: "i",
                          },
                      },
                  },
              ]
            : []),

        {
            $sort: {
                createdAt: -1,
            },
        },

        {
            $skip: skip,
        },

        {
            $limit: limit,
        },
    ]);

    const totalProducts = await Product.aggregate([
        {
            $match: matchStage,
        },

        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        },

        {
            $unwind: "$category",
        },

        ...(req.query.category
            ? [
                  {
                      $match: {
                          "category.name": {
                              $regex: req.query.category,
                              $options: "i",
                          },
                      },
                  },
              ]
            : []),

        {
            $count: "total",
        },
    ]);

    res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil((totalProducts[0]?.total || 0) / limit),
        totalProducts: totalProducts[0]?.total || 0,
        results: products.length,
        data: products,
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