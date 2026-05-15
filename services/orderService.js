const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const PromoCode = require("../models/promocodesModel");
const sendEmail = require("../utils/sendEmail");

exports.createOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { address, promoCode } = req.body;

  // 1. get cart
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return next(new ApiError("Cart is empty", 400));
  }

  let totalAmount = 0;
  let orderItems = [];

  // 2. validate products + calculate total
  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      return next(new ApiError("Product not found", 404));
    }

    if (product.stock < item.quantity) {
      return next(new ApiError(`Not enough stock for ${product.name}`, 400));
    }

    const price = product.price; 

    totalAmount += price * item.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
  }

  // 3. apply promo code (optional)
  let discount = 0;

  if (promoCode) {
    const promo = await PromoCode.findOne({ code: promoCode });

    if (!promo) {
      return next(new ApiError("Invalid promo code", 400));
    }

    if (promo.expirationDate < new Date()) {
      return next(new ApiError("Promo code expired", 400));
    }

    if (promo.timesUsed >= promo.usageLimit) {
      return next(new ApiError("Promo code usage limit reached", 400));
    }

    discount = (totalAmount * promo.discountPercentage) / 100;

    promo.timesUsed += 1;
    await promo.save();
  }

  // 4. final amount
  const shipping = 0;
  const finalAmount = totalAmount - discount + shipping;

  // 5. create order
  const order = await Order.create({
    user: userId,
    address,
    items: orderItems,
    totalAmount: finalAmount,
    paymentType: "cash",
    discountCode: promoCode || null,
  });

  // 6. decrease stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  // 7. clear cart
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  const message = `Your order ${order._id} has been placed successfully! Total: $${finalAmount.toFixed(2)} Thank you for shopping with us!`;
  await sendEmail({
    to: req.user.email,
    subject: "Order Confirmation",
    text: message,
  });

  res.status(201).json({ data: order });
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .populate("items.product", "name price images");

  res.status(200).json({
    results: orders.length,
    data: orders,
  });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("items.product");

  if (!order) {
    return next(new ApiError("Order not found", 404));
  }

  res.status(200).json({ data: order });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    return next(new ApiError("Order not found", 404));
  }
  if (status === "delivered") {
    order.isDelivered = true;
    await order.save();
    const message = `Your order ${order._id} has been delivered! Thank you for shopping with us!`;
    await sendEmail({
      to: req.user.email,
      subject: "Order Delivered",
      text: message,
    });
  }else if (status === "shipped"){
    const message = `Your order ${order._id} has been shipped! It will be delivered soon. Thank you for shopping with us!`;
    await sendEmail({
      to: req.user.email,
      subject: "Order Shipped",
      text: message,
    });
  }else if (status === "cancelled"){
    const message = `Your order ${order._id} has been cancelled! If you have any questions, please contact our support. Thank you for shopping with us!`;
    await sendEmail({
      to: req.user.email,
      subject: "Order Cancelled",
      text: message,
    });
  }


  res.status(200).json({ data: order });
});

exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("items.product name price stock");

    if (!order) {
    return next(new ApiError("Order not found", 404));
  }

    if (order.status !== "pending") {
    return next(new ApiError("Only pending orders can be cancelled", 400));
  }

    order.status = "cancelled";
    await order.save();
    // restore stock
    for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: item.quantity },
    });
  }

    res.status(200).json({ data: order });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "name price");

  res.status(200).json({
    results: orders.length,
    data: orders,
  });
});

exports.getOrdersStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({ data: stats });
});

exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const { paymentStatus } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { paymentStatus },
    { new: true, runValidators: true }
  );

  if (!order) {
    return next(new ApiError("Order not found", 404));
  }

  res.status(200).json({ data: order });
});

exports.deliverOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { 
      status: "delivered",
      isDelivered: true,
     },
    { new: true, runValidators: true }
  );

  if (!order) {
    return next(new ApiError("Order not found", 404));
  }
  const message = `Your order ${order._id} has been delivered! Thank you for shopping with us!`;
    await sendEmail({
      to: req.user.email,
      subject: "Order Delivered",
      text: message,
    });

  res.status(200).json({ data: order });
});