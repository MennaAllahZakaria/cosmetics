const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const ApiError = require("../utils/apiError");
const Favorite = require("../models/favoritesModel");

exports.toggleFavorite = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const existing = await Favorite.findOne({ user: userId, product: productId });

  if (existing) {
    await existing.deleteOne();
    return res.json({ status: "removed" });
  }

  await Favorite.create({ user: userId, product: productId });
  
  res.json({ status: "added" });
});

exports.getMyFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const favorites = await Favorite.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },

    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    // exclude deleted products
    { $match: { "product.isDeleted": { $ne: true } } },

    {
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "product.category",
      },
    },

    // convert category array → object
    {
      $unwind: {
        path: "$product.category",
        preserveNullAndEmptyArrays: true,
      },
    },

    { $skip: skip },
    { $limit: limit },
  ]);

  res.status(200).json({
    page,
    limit,
    hasNext: favorites.length === limit,
    results: favorites.length,
    data: favorites,
  });
});