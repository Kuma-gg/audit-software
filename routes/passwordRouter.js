const express = require("express");
const router = express.Router();

const appRouter = (io) => {
	/* GET home page. */
	const passwordController = require("../controllers/passwordController")(io);
	router.get("/", ensureAuthenticated, passwordController.passwordPage);
	return router;
};

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect("/");
}

module.exports = appRouter;
