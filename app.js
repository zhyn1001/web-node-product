var db = require('./db/db')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');

var indexRouter = require('./routes/home/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var usersRouter = require('./routes/users/users');
var productRouter = require('./routes/product/product');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'zymmcode',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000 * 60 * 3
	}
}))

app.use(function(req, res, next){//自定义中间件(判断是否登陆)
	if(req.url === '/login'){
		next()
	} else {
		if(req.session && req.session.userInfo && req.session.userInfo.username !== "") {
			app.locals['userInfo'] = req.session.userInfo
			next()
		} else {
			// res.redirect('/login')
			app.locals['userInfo'] = {username:''}
			next()
		}
	}
})

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
