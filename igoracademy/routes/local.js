/**
 * Created by Игорь on 17.06.2014.
 */

function router(app) {
  var passport = app.get('config').passport;
  app.get('/signup', function (req, res) {
    res.sendfile('public/signup.html');
  });
  app.get('/login', function (req, res) {
    res.sendfile('public/login.html');
  });
  /*app.get('/destroy', function (req, res) {
    req.session.destroy(function (err) {
      console.log("iam destroy")
    });
  })*/
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
}
module.exports=router;
