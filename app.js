var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var info = require('./package.json');

var personRouter = require('./routes/person');
var killmeRouter = require('./routes/kill-me');

var app = express();
var io = app.io = require('socket.io')();
var ioPerson = io.of("/person");

// app settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('version', info.version);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', personRouter(ioPerson));
app.use('/killme', killmeRouter);

// catch 404 and forward to error handler.
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});
module.exports = app;