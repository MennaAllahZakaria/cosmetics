const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const ApiError = require("../utils/apiError");
const Favorite = require("../models/favoritesModel");

exports.toggleFavorite = asyncHandler(async (req, res) => {
    const query = req.user
      ? { user: req.user._id }
      : { guestId: req.guestId };

    const { productId } = req.params;

    let favorites = await Favorite.findOne(query);

    // create favorites doc if not exists
    if (!favorites) {
      favorites = await Favorite.create({
        ...query,
        products: [],
      });
    }

    const exists = favorites.products.some(
        (id) => id.toString() === productId
      );

    if (exists) { 
      favorites.products = favorites.products.filter(
          (id) =>
            id.toString() !== productId
        );

      await favorites.save();

      return res.json({
        status: "removed",
      });
    }

    favorites.products.push(productId);

    await favorites.save();

    res.json({
      status: "added",
    });
  });

exports.getMyFavorites = asyncHandler(async (req, res) => {
    const query = req.user
      ? { user: req.user._id }
      : { guestId: req.guestId };

    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const favorites =
      await Favorite.aggregate([
        {
          $match: query,
        },

        {
          $unwind: "$products",
        },

        {
          $lookup: {
            from: "products",
            localField: "products",
            foreignField: "_id",
            as: "product",
          },
        },

        {
          $unwind: "$product",
        },

        // exclude deleted products
        {
          $match: {
            "product.isDeleted": {
              $ne: true,
            },
          },
        },

        {
          $lookup: {
            from: "categories",
            localField:
              "product.category",
            foreignField: "_id",
            as: "product.category",
          },
        },

        {
          $unwind: {
            path: "$product.category",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $replaceRoot: {
            newRoot: "$product",
          },
        },

        {
          $skip: skip,
        },

        {
          $limit: limit + 1,
        },
      ]);

    const hasNext =
      favorites.length > limit;

    if (hasNext) favorites.pop();

    res.status(200).json({
      page,
      limit,
      hasNext,
      results: favorites.length,
      data: favorites,
    });
  }
);