/**
 * Created by Игорь on 17.06.2014.
 */

function router(app,io) {

    function isAdmin(req, res, next) {
       // console.log("USER",req.user.position!==undefined)
        if (req.isAuthenticated()&&req.user) {
            if(req.user.position){
                return next()
            }
        }

        res.redirect("/#/login");
    }
  function hasUser(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/#/login");
  }

    var jwt   = require('jwt-simple');

 function hasAccess(req,res,next){

     if (!req.isAuthenticated()) {
         return next();
     }
     res.redirect("/#/login");
   /*  if (!req.headers.authorization) {
         res.redirect("/#/login");
         return
     }

     var token = req.headers.authorization.split(' ')[1];
     var payload = jwt.decode(token, TheSecret);

     if (payload.exp <= Date.now()) {
         return res.status(401).send({
             message: 'Token has expired'
         });
     }

     req.user = payload.sub;
     return next();*/

 }





  var google = require('./account/google')(app);
  var facebook = require('./account/facebook')(app);
  var twitter = require('./account/twitter')(app);
  var local = require('./account/local')(app,hasAccess);
  var user = require('./account/user')(app,hasUser);
  var main = require('./account/main')(app,hasUser);
  var autorization=require('./account/autorization')(app,hasAccess);
  var newPost=require('./posts/newpost')(app,hasUser,io);
    var deletePost=require('./posts/deletpost')(app,hasUser);
    var postcomment=require('./posts/postcomment')(app,hasUser,io);
    var postsearch=require('./posts/postsearch')(app,hasUser);
    var subject = require('./courses/subject')(app,isAdmin,hasUser);
  var logout=require('./account/logout')(app);
    var notify=require('./notify/notify')(app,hasUser);
    var answer=require('./posts/newanswer')(app,hasUser);
}

module.exports = router;

