const express = require("express");
const publicRoutes = require("../routes/publicRoutes");
const privateRoutes = require("../routes/privateRoutes");
const tokenMiddleware = require("../middlewares/tokenMiddleware");

const Routes = express.Router();

Routes.use("/public", publicRoutes);
Routes.use("/private", tokenMiddleware, privateRoutes);


module.exports = Routes;
