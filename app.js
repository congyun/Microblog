/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require("express-ejs-layouts");
var partials = require('express-partials');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var settings = require('./settings');
var routes = require('./routes');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(partials());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(expressLayouts);
app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
      db: settings.db
    }),
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/u/:user', routes.user);

app.post('/post', routes.checkLogin);
app.post('/post', routes.post);

app.get('/reg', routes.checkNotLogin);
app.get('/reg', routes.reg);

app.post('/reg', routes.checkNotLogin);
app.post('/reg', routes.doReg);

app.get('/login', routes.checkNotLogin);
app.get('/login', routes.login);

app.post('/login', routes.checkNotLogin);
app.post('/login', routes.doLogin);

app.get('/logout', routes.checkLogin);
app.get('/logout', routes.logout);

//End of logic code

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;