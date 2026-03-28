const authRoute = require("./authRoute");
const categoryRoute = require("./categoryRoute");
const productRoute = require("./productRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");
const reviewRoute = require("./reviewRoute");
const favoritesRoute = require("./favoritesRoute");
const promocodeRoute = require("./promocodeRoute");




const mountRoutes = (app) => {
    app.use((req, res, next) => {
        const origin = req.headers.origin;

        if (origin) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
        }

        res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        );
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.header("Access-Control-Allow-Credentials", "true");

        if (req.method === "OPTIONS") {
        return res.sendStatus(200);
        }

        next();
    });

//=============================
// Mounting various routes
//=============================
    app.use("/auth", authRoute);
    app.use("/categories", categoryRoute);
    app.use("/products", productRoute);
    app.use("/cart", cartRoute);
    app.use("/orders", orderRoute);
    app.use("/reviews", reviewRoute);
    app.use("/favorites", favoritesRoute);
    app.use("/promocodes", promocodeRoute);


//=============================
// 404 Handler
//=============================
app.use((req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find this route: ${req.originalUrl}`,
    });
});

}

module.exports = mountRoutes;
