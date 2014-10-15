 /*
 * GET home page.
 */

var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');

exports.index = function(req, res) {
    res.render('index', {
            title: 'Home page',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            posts: posts
        });
    Post.get(null, function(err, posts) {
        if (err) {
            posts = [];
        }
    });
};

exports.user = function(req, res) {
    User.get(req.params.user, function(err, user) {
        if (!user) {
            req.flash('error', 'No such user');
            return res.redirect('/');
        }
        Post.get(user.name, function(err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('user', {
                title: user.name,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                posts: posts
            });
        });
    });
};

exports.post = function(req, res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function(err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', 'Successfully submitted');
        res.redirect('/u/' + currentUser.name);
    });
};

exports.reg = function(req, res) {
    res.render('reg', {
        title: 'Sign up',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
};

exports.doReg = function(req, res) {
    if (req.body['password-repeat'] !== req.body['password']) {
        req.flash('error', 'Your password does not match ');
        return res.redirect('/reg');
    }

    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    var newUser = new User({
        name: req.body.username,
        password: password
    });

    User.get(newUser.name, function(err, user) {
        if (user) {
            err = 'Username has been taken';
        }
        if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }

        newUser.save(function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }

            req.session.user = newUser;
            req.flash('success', 'Successfully registered');
            res.redirect('/');
        });
    });
};

exports.login = function(req, res) {
    res.render('login', {
        title: 'Sign in',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
};

exports.doLogin = function(req, res) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username, function(err, user) {
        if (!user) {
            req.flash('error', 'No such user');
            return res.redirect('/login');
        }
        if (user.password !== password) {
            req.flash('error', 'Incorrect password');
            return res.redirect('/login');
        }
        req.session.user = user;
        req.flash('success', 'Sign in successfully');
        res.redirect('/');
    });
};

exports.logout = function(req, res) {
    req.session.user = null;
    req.flash('success', 'Sign out successfully');
    res.redirect('/');
};

exports.checkLogin = function(req, res, next) {
    if (!req.session.user) {
        req.flash('error', 'Not login');
        return res.redirect('/login');
    }
    next();
};
exports.checkNotLogin = function(req, res, next) {
    if (req.session.user) {
        req.flash('error', 'Not logout');
        return res.redirect('/');
    }
    next();
};
