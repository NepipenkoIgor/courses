/**
 * Created by Игорь on 17.06.2014.
 */
var passport = require('passport');

function router(app) {
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/oauth2callback',
        passport.authenticate('google', {
            successRedirect: '/#/welcome',
            failureRedirect: '/#/welcome'
        }));
}
module.exports = router;