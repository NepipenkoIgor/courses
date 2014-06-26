/**
 * Created by Игорь on 17.06.2014.
 */
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')({session: session});
var passport = require('passport');

module.exports = function (app) {

    app.use(favicon());
    app.use(logger('dev'));
    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());

    var mongoUri = process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        'mongodb://localhost/test';

    app.use(session({
        secret: 'keyboard cat',
        proxy: true,
        store: new MongoStore({
            url: mongoUri
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};

