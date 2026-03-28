const asyncHandler = require("express-async-handler");

const Favorite = require("../models/favoritesModel");

exports.toggleFavorite = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

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
    { $match: { user: userId } },

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

    { $skip: skip },
    { $limit: limit },
  ]);

  res.status(200).json({
    results: favorites.length,
    data: favorites,
  });
});