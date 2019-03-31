var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var info = require('./package.json');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var flash = require('connect-flash');

/* App socket */
var app = express();
var io = app.io = require('socket.io')();
var ioUser = io.of("/user");

/* Passport for user auth */
const lolpez = { id: 666, name: "Luis", lastName: "Lopez", email: "luis@gmail.com", role: { id: 777, name: "manager" } };
passport.use(new Strategy(function (username, password, callback) {
	if (username == 'admin' && password == 'password') {
		return callback(null, lolpez);
	} else {
		return callback(null, false)
	}
}));

passport.serializeUser(function (user, callback) {
	callback(null, user.id);
});

passport.deserializeUser(function (id, callback) {
	if (id == 666) {
		callback(null, lolpez);
	} else {
		//The user does not exists
		return callback(null, false)
	}
});

/* App settings */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('version', info.version);
app.set('app-name', info.appName);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/* Routes */
var indexRouter = require('./routes/indexRouter');
var userRouter = require('./routes/person');
var killMeRouter = require('./routes/kill-me');
app.use('/', indexRouter);
app.use('/users', userRouter(ioUser));
app.use('/killme', killMeRouter);

/* catch 404 and forward to error handler. */
app.use((req, res, next) => {
	next(createError(404));
});

/* error handler */
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});
module.exports = app;