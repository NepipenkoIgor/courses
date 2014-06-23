/**
 * Created by Игорь on 17.06.2014.
 */


function router(app) {
  var passport = app.get('config').passport;
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/main',
      failureRedirect: '/'
    }));
}
module.exports=router;

