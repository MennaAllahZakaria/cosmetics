const express = require("express");

const {
    toggleFavorite,
    getMyFavorites
} = require("../services/favoritesService");

const { toggleFavoriteValidator } = require("../utils/validators/favoritesValidator");

const { protect, allowedTo } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/toggle", toggleFavoriteValidator, toggleFavorite);
router.get("/my-favorites", getMyFavorites);

module.exports = router;
