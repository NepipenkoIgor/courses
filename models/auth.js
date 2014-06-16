/**
 * Created by Игорь on 11.06.2014.
 */
module.exports = {

  'facebookAuth' : {
    'clientID' : '325844220898693', // your App ID
    'clientSecret': '968120395265c661d7b21aae8157006d', // your App Secret
    'callbackURL' : 'http://localhost:4000/auth/facebook/callback'
  },

  'twitterAuth' : {
    'consumerKey' : 'Z7A0ngButmWvTVNKrQQICLKCU',
    'consumerSecret': 'ex4iB1PVrH8W53k8OntkI05hj8GHP18phwOFPGzwU44luYwaPy',
    'callbackURL' : 'http://127.0.0.1:4000/auth/twitter/callback'
  },

  'googleAuth' : {
    'clientID' : '307149004912-rhg5rsje8pug47m8b8ac6jmk6ip732rt.apps.googleusercontent.com',
    'clientSecret' : 'FXOkLUa_ARF4h9UnOQIZoP_p',
    'callbackURL' : 'http://localhost:4000/oauth2callback'
  }

};