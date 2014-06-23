/**
 * Created by Игорь on 17.06.2014.
 */

function router(app) {


  function hasUser(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/");
  };

  var google = require('./google')(app);
  var facebook = require('./facebook')(app);
  var twitter = require('./twitter')(app);
  var local = require('./local')(app);
  var user = require('./user')(app,hasUser);
  var main = require('./main')(app,hasUser);
  var autorization=require('./autorization')(app);
  //var all=require('./all')(app);
  var logout=require('./logout')(app);
}

module.exports = router

