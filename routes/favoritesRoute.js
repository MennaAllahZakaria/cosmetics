const express = require("express");

const {
    toggleFavorite,
    getMyFavorites
} = require("../services/favoritesService");

const { toggleFavoriteValidator } = require("../utils/validators/favoritesValidator");

const { protect, allowedTo ,identifyUser} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(identifyUser);

router.post("/toggle/:productId", toggleFavoriteValidator, toggleFavorite);
router.get("/my-favorites", getMyFavorites);

module.exports = router;
