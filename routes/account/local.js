/**
 * Created by Игорь on 17.06.2014.
 */
var passport = require('passport');

function router(app,hasAccess) {

//  app.get('/signup',hasAccess, function (req, res) {
//    res.sendfile('public/signup.html');
//  });
//  app.get('/login',hasAccess, function (req, res) {
//    res.sendfile('public/login.html');
//  });
  /*app.get('/destroy', function (req, res) {
    req.session.destroy(function (err) {
      console.log("iam destroy")
    });
  })*/
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/#/dashboard', // redirect to the secure profile section
    failureRedirect: '/#/login' // redirect back to the signup page if there is an error
    // failureFlash : true // allow flash messages
  }));

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/#/dashboard', // redirect to the secure profile section
    failureRedirect: '/#/signup' // redirect back to the signup page if there is an error
    //failureFlash : true // allow flash messages
  }));
    app.post('/signup/admin', passport.authenticate('local-admin', {
        successRedirect: '/#/dashboard', // redirect to the secure profile section
        failureRedirect: '/#/login/admin' // redirect back to the signup page if there is an error
        //failureFlash : true // allow flash messages
    }));



}
module.exports=router;
