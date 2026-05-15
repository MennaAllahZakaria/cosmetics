const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    guestId: {
      type: String,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// one favorites document per user
favoriteSchema.index(
  { user: 1 },
  {
    unique: true,
    partialFilterExpression: {
      user: { $exists: true },
    },
  }
);

// one favorites document per guest
favoriteSchema.index(
  { guestId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      guestId: { $exists: true },
    },
  }
);

module.exports = mongoose.model("Favorite", favoriteSchema);