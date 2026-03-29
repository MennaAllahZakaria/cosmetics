const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const PromoCode = require("../models/promoCodeModel");

exports.createPromoCode = asyncHandler(async (req, res) => {
  const {
    code,
    discountPercentage,
    expirationDate,
    usageLimit,
  } = req.body;

  const promo = await PromoCode.create({
    code: code.toUpperCase(),
    discountPercentage,
    expirationDate,
    usageLimit,
  });

  res.status(201).json({ data: promo });
});

exports.applyPromoCode = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { code } = req.body;

  const promo = await PromoCode.findOne({ code: code.toUpperCase() });

  if (!promo) {
    return next(new ApiError("Invalid promo code", 400));
  }

  // 1. check expiration
  if (promo.expirationDate < new Date()) {
    return next(new ApiError("Promo code expired", 400));
  }

  // 2. check usage limit
  if (promo.timesUsed >= promo.usageLimit) {
    return next(new ApiError("Promo code fully used", 400));
  }

  // 3. check user usage
  if (promo.usedBy?.includes(userId)) {
    return next(new ApiError("You already used this code", 400));
  }

  res.status(200).json({
    discountPercentage: promo.discountPercentage,
  });
});

exports.getAllPromoCodes = asyncHandler(async (req, res) => {
  const promos = await PromoCode.find();

  res.status(200).json({
    results: promos.length,
    data: promos,
  });
});

