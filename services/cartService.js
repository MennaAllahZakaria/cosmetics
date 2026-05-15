const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");


exports.addToCart = asyncHandler(async (req, res, next) => {
  const query = req.user
    ? { user: req.user._id }
    : { guestId: req.guestId };
    
  const { productId, quantity = 1 } = req.body;

  // 1. check product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  // 2. check stock
  if (product.stock < quantity) {
    return next(new ApiError("Not enough stock", 400));
  }

  // 3. get user cart
  let cart = await Cart.findOne(query);

  if (!cart) {
    cart = await Cart.create({
      ...query,
      items: [],
    });
  }

  // 4. check if product exists in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // product exists → increase quantity
    cart.items[itemIndex].quantity += quantity;

    // check stock again
    if (cart.items[itemIndex].quantity > product.stock) {
      return next(new ApiError("Exceeds available stock", 400));
    }
  } else {
    // add new product
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  // 5. calculate total price
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(200).json({ data: cart });
});

exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const query = req.user
    ? { user: req.user._id }
    : { guestId: req.guestId };
  const { productId } = req.params;

  const cart = await Cart.findOne(query);

  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  // recalculate total
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(200).json({ data: cart });
});

exports.decreaseCartItem = asyncHandler(async (req, res, next) => {
  const query = req.user
    ? { user: req.user._id }
    : { guestId: req.guestId };
  const { productId } = req.params;

  const cart = await Cart.findOne(query);

  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new ApiError("Product not found in cart", 404));
  }

  // if quantity > 1 → decrease quantity, else remove item
  if (cart.items[itemIndex].quantity > 1) {
    cart.items[itemIndex].quantity -= 1;
  } else {
    cart.items.splice(itemIndex, 1);
  }

  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();

  res.status(200).json({
    message: "Cart updated successfully",
    data: cart,
  });
});

exports.getMyCart = asyncHandler(async (req, res, next) => {
  const query = req.user
    ? { user: req.user._id }
    : { guestId: req.guestId };

  const cart = await Cart.findOne(query).populate({
    path: "items.product",
    select: "name price images stock",
  });

  if (!cart) {
    return res.status(200).json({ data: { items: [], totalPrice: 0 } });
  }
  const totalItems = cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  res.status(200).json({
    itemsCount: totalItems,
    data: cart,
  });
});
