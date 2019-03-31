var express = require("express");
var router = express.Router();
var passport = require("passport");
var indexController = require("../controllers/indexController");

/* GET home page. */
router.get("/", indexController.loginPage);
router.get("/logout", ensureAuthenticated, indexController.logout);
router.post("/", passport.authenticate("local", { failureRedirect: "/", failureFlash: true, failureFlash: "Incorrect user credentials." }), indexController.authenticate);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect("/");
}

module.exports = router;