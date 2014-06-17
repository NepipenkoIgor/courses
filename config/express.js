/**
 * Created by Игорь on 17.06.2014.
 */
module.exports=function(app){
  var express=require('express');
var   path = require('path');
var   favicon = require('static-favicon');
var   logger = require('morgan');
var   cookieParser = require('cookie-parser');
var   bodyParser = require('body-parser');
var   mongoose = require('mongoose');
var session = require('express-session');
var  MongoStore = require('connect-mongo')({session: session});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var   FacebookStrategy = require('passport-facebook').Strategy;
var  TwitterStrategy = require('passport-twitter').Strategy;
var  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  proxy: true,
  store: new MongoStore({
    url: "mongodb://localhost/test/users"
  })
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

  var config={
    'passport': passport,
    'mongoose': mongoose,
    'LocalStrategy':LocalStrategy,
    'FacebookStrategy':FacebookStrategy,
    'TwitterStrategy':TwitterStrategy,
    'GoogleStrategy':GoogleStrategy
  }
  app.set('config',config);

}

