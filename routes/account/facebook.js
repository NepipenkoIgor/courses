/**
 * Created by Игорь on 17.06.2014.
 */
var passport = require('passport');

function router(app) {

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/#/welcome',
      failureRedirect: '/#/welcome'
    }));
}
module.exports=router;

