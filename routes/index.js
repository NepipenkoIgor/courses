/**
 * Created by Игорь on 17.06.2014.
 */

function router(app) {


  function hasUser(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/#/welcome");
  };
 function hasAccess(req,res,next){
     console.log(req.isAuthenticated());
     if (!req.isAuthenticated()) {
         return next();
     }
     res.redirect("/#/welcome");

 }
  var google = require('./google')(app);
  var facebook = require('./facebook')(app);
  var twitter = require('./twitter')(app);
  var local = require('./local')(app,hasAccess);
  var user = require('./user')(app,hasUser);
  var main = require('./main')(app,hasUser);
  var autorization=require('./autorization')(app,hasAccess);
  var newPost=require('./newpost')(app,hasUser);
    var deletePost=require('./deletpost')(app,hasUser);
    var postcomment=require('./postcomment')(app,hasUser);
  var logout=require('./logout')(app);
}

module.exports = router;

