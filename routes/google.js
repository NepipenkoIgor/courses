/**
 * Created by Игорь on 17.06.2014.
 */

function router(app) {
  var passport = app.get('config').passport;
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/oauth2callback',
    passport.authenticate('google', {
      successRedirect: '/main',
      failureRedirect: '/'
    }));
}
module.exports=router;