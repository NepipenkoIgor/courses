'use strict';
var express = require('express');

var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var User = require('./models/usermodel');
var authConfig = require('./models/auth.js');


var session = require('express-session');
var MongoStore = require('connect-mongo')({session: session});


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var app = express();


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


//Passport controler

passport.serializeUser(function (user, done) {
  done(null, user);
});

// used to deserialize the user отличительно приходит вместо айдишника обьект
passport.deserializeUser(function (objprof, done) {
  User.findById(objprof._id, function (err, user) {
    done(err, user);
  });
});


passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function (req, email, password, done) {
    User.findOne({ 'email': email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    });
  }));


passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function (req, email, password, done) {
    console.log('email', email);
    process.nextTick(function () {
      User.findOne({ 'email': email }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          //return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.email = email;
          var date = new Date();
          newUser.lid = date.getTime();
          newUser.password = password;
          newUser.save(function (err) {
            if (err) {
              console.log(err);
            }
            newUser.id = newUser['_id'];
            return done(null, newUser);
          });
        }
      });
    });
  }));


passport.use(new GoogleStrategy({
    clientID: authConfig.googleAuth.clientID,
    clientSecret: authConfig.googleAuth.clientSecret,
    callbackURL: authConfig.googleAuth.callbackURL
  },
  function (accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      User.findOne({ 'id': profile.id }, function (err, user) {
        if (err) {
          return done(err);
        }
        ;
        if (user) {
          return done(null, user);
        } else {
          var newUser = new User();
          newUser.username = profile.name.givenName + " " + profile.name.familyName;
          newUser.gid = profile.id;
          newUser.email = profile.email;
          newUser.save(function (err) {
            return done(null, newUser);
          });
        }
      });
    });
  }));


passport.use(new FacebookStrategy({
    clientID: authConfig.facebookAuth.clientID,
    clientSecret: authConfig.facebookAuth.clientSecret,
    callbackURL: authConfig.facebookAuth.callbackURL

  },
  function (token, refreshToken, profile, done) {
    process.nextTick(function () {
      User.findOne({ fid: profile.id }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        }
        var newUser = new User({
          fid: profile.id,
          username: profile.name.givenName + " " + profile.name.familyName,
          email: profile.emails[0].value
        });

        newUser.save(function (err, user) {
          return done(null, user);
        });
      });
    });
  }));


passport.use(new TwitterStrategy({

    consumerKey: authConfig.twitterAuth.consumerKey,
    consumerSecret: authConfig.twitterAuth.consumerSecret,
    callbackURL: authConfig.twitterAuth.callbackURL

  },
  function (token, tokenSecret, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }));


//DB controller


mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('open', function () {
  console.log('iam connect test db');
});


app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/main', // redirect to the secure profile section
  failureRedirect: '/' // redirect back to the signup page if there is an error
  // failureFlash : true // allow flash messages
}));

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/main', // redirect to the secure profile section
  failureRedirect: '/' // redirect back to the signup page if there is an error
  //failureFlash : true // allow flash messages
}));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// the callback after google has authenticated the user
app.get('/oauth2callback',
  passport.authenticate('google', {
    successRedirect: '/main',
    failureRedirect: '/'
  }));


app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/main',
    failureRedirect: '/'
  }));


app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/main',
    failureRedirect: '/'
  }));
app.get('/signup', function (req, res) {
  res.sendfile('public/signup.html');
});
app.get('/login', function (req, res) {
  res.sendfile('public/login.html');
});
app.get('/destroy', function (req, res) {
  req.session.destroy(function (err) {
    console.log("iam destroy")
  });
})
app.get('/main', function (req, res) {
  console.log(req.user);
  //if(req.user.name) return  res.send( "hellow: " +'<h1>'+req.user.name+'</h1>');
  res.send(req.user);

});

app.get('/user', function (req, res) {
  console.log();
  res.json(req.user);
});


app.listen(4000);
console.log("start server 4000");


