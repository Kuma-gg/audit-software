const express = require("express");
const router = express.Router();

const appRouter = (io) => {
	/* GET home page. */
	const userController = require("../controllers/userController")(io);
	router.get("/", ensureAuthenticated, userController.userPage);
	return router;
};

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect("/");
}

module.exports = appRouter;
