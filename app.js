var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var info = require("./package.json");
var passport = require("passport");
var Strategy = require("passport-local").Strategy;
var flash = require("connect-flash");
var md5 = require("md5");
var modelUser = require("./models/user");

/* App socket */
var app = express();
var io = app.io = require("socket.io")();
var ioUser = io.of("/user");

/* Passport for user auth */
passport.use(new Strategy(function (username, password, callback) {
	modelUser.checkUserCredentials(username, md5(password)).then((user) => {
		if (user) {
			return callback(null, {
				id: user._id,
				name: user.name,
				lastName: user.lastName,
				role: user.role
			});
		} else {
			return callback(null, false);
		}
	});
}));

passport.serializeUser(function (user, callback) {
	callback(null, user.id);
});

passport.deserializeUser(function (id, callback) {
	modelUser.select({ id: id }).then((user) => {
		if (user.length == 1) {
			callback(null, {
				id: user[0]._id,
				name: user[0].name,
				lastName: user[0].lastName,
				role: { id: 777, name: "manager" }
			});
		} else {
			//The user does not exist
			return callback(null, false);
		}
	});
});

/* App settings */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("version", info.version);
app.set("app-name", info.appName);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(require("express-session")({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/* Routes */
var indexRouter = require("./routes/indexRouter");
var userRouter = require("./routes/userRouter");
var killMeRouter = require("./routes/kill-me");
app.use("/", indexRouter);
app.use("/users", userRouter(ioUser));
app.use("/killme", killMeRouter);

/* catch 404 and forward to error handler. */
app.use((req, res, next) => {
	next(createError(404));
});

/* error handler */
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});
module.exports = app;