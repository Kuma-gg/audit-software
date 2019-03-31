var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	process.exit(1);
});

module.exports = router;
