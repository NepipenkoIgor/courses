/**
 * Created by Игорь on 17.06.2014.
 */
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = mongoose.model('Users');

function session(app) {
var config=app.get('config');
//console.log(app.get('config'))
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
            clientID: config.GOOGLE_CLIENT_ID||process.env.GOOGLEID,//config.GOOGLEID,//authConfig.googleAuth.clientID,
            clientSecret:config.GOOGLE_CLIENT_SECRET ||process.env.GOOGLESECRET,//authConfig.googleAuth.clientSecret,
            callbackURL:config.GOOGLE_CALLBACK_URL ||process.env.GOOGLECALLBACK//authConfig.googleAuth.callbackURL
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
            clientID: config.FACEBOOK_CLIENT_ID||process.env.FACEBOOKID,// authConfig.facebookAuth.clientID,
            clientSecret:config.FACEBOOK_CLIENT_SECRET || process.env.FACEBOOKSECRET,//authConfig.facebookAuth.clientSecret,
            callbackURL: config.FACEBOOK_CALLBACK_URL|| process.env.FACEBOOKCALLBACK//authConfig.facebookAuth.callbackURL

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


  /*  passport.use(new TwitterStrategy({

            consumerKey: authConfig.twitterAuth.consumerKey,
            consumerSecret: authConfig.twitterAuth.consumerSecret,
            callbackURL: authConfig.twitterAuth.callbackURL

        },
        function (token, tokenSecret, profile, done) {
            process.nextTick(function () {
                return done(null, profile);
            });
        }));*/


    /*passport.use(new GoogleStrategy({
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
     }));*/


}

module.exports = session;