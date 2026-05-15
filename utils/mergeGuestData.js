const Cart = require("../models/cartModel");
const Favorite = require("../models/favoritesModel");

exports.mergeGuestData = async ({
    userId,
    guestId,
}) => {
    if (!guestId) return;

    /*
     =========================
     MERGE CART
     =========================
    */

    const guestCart = await Cart.findOne({
        guestId,
    });

    let userCart = await Cart.findOne({
        user: userId,
    });

    if (guestCart) {
        // if user has no cart
        if (!userCart) {
            guestCart.user = userId;
            guestCart.guestId = undefined;

            await guestCart.save();
        } else {
            // merge items
            guestCart.items.forEach((guestItem) => {
                const existingItem =
                    userCart.items.find(
                        (item) =>
                            item.product.toString() ===
                            guestItem.product.toString()
                    );

                if (existingItem) {
                    existingItem.quantity +=
                        guestItem.quantity;
                } else {
                    userCart.items.push(guestItem);
                }
            });

            // recalculate total
            userCart.totalPrice =
                userCart.items.reduce(
                    (acc, item) =>
                        acc +
                        item.price * item.quantity,
                    0
                );

            await userCart.save();

            await guestCart.deleteOne();
        }
    }

    /*
     =========================
     MERGE FAVORITES
     =========================
    */

    const guestFavorites =
        await Favorite.find({
            guestId,
        });

    for (const favorite of guestFavorites) {
        const exists =
            await Favorite.findOne({
                user: userId,
                product: favorite.product,
            });

        if (!exists) {
            await Favorite.create({
                user: userId,
                product: favorite.product,
            });
        }

        await favorite.deleteOne();
    }
};