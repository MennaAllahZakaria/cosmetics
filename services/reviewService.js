const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

exports.createReview = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId, rating, comment } = req.body;
    // 1. validate product
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ApiError("Product not found", 404));
    }
    
    // 2. check if user already reviewed
    const existing = await Review.findOne({ user: userId, product: productId });

    if (existing) {
      return next(new ApiError("You have already reviewed this product", 400));
    }

    // 3. create review
    const review = await Review.create({
      user: userId,
        product: productId,
        rating,
        comment,
    });

    // 4. update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    product.ratingsAverage = avgRating;
    product.ratingsQuantity = reviews.length;
    await product.save();



    res.status(201).json({
        status: "success",
        data: review,
    });
});

exports.getProductReviews = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
    // 1. validate product
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ApiError("Product not found", 404));
    }

    // 2. get reviews
    const reviews = await Review.find({ product: productId }).populate("user", "name");

    res.status(200).json({
        results: reviews.length,
        data: reviews,
    });
});



exports.updateReview = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const reviewId = req.params.id;
  const { rating, comment } = req.body;
    const review = await Review.findById(reviewId);

    if (!review) {
      return next(new ApiError("Review not found", 404));
    }
    if (review.user.toString() !== userId.toString()) {
      return next(new ApiError("You can only update your own reviews", 403));
    }
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.status(200).json({
        status: "success",
        data: review,
    });
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const reviewId = req.params.id;
    const review = await Review.findById(reviewId);

    if (!review) {
      return next(new ApiError("Review not found", 404));
    }
    if (review.user.toString() !== userId.toString()) {
      return next(new ApiError("You can only delete your own reviews", 403));
    }
    await review.deleteOne();

    res.status(204).send();
});