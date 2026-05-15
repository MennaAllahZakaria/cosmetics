const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");

// ================== PROTECT ==================
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization) {
        if (req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } else {
            token = req.headers.authorization;
        }
    }

    if (!token) {
        return next(new ApiError("You are not logged in. Please login first.", 401));
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError("The user belonging to this token no longer exists.", 401));
    }

    req.user = currentUser;
    next();
});

// ================== ALLOWED TO ==================
exports.allowedTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
        return next(new ApiError("You do not have permission to perform this action", 403));
        }
        next();
    };
};

exports.identifyUser = async (req, res, next) => {
    const token = req.headers.authorization;

    // Logged in user
    if (token && token.startsWith("Bearer")) {
        try {
            const jwtToken = token.split(" ")[1];

            const decoded = jwt.verify(
                jwtToken,
                process.env.JWT_SECRET
            );

            req.user = decoded;

            return next();
        } catch (err) {
            console.log(err);
        }
    }

    // Guest user
    let guestId = req.headers["guest-id"];

    if (!guestId) {
        guestId = uuidv4();
    }

    req.guestId = guestId;

    res.setHeader("guest-id", guestId);

    next();
};