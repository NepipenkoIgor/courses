/**
 * Created by Игорь on 17.06.2014.
 */

var mongoose = require('mongoose');
var User = mongoose.model('Users');
function router(app, hasUser) {

  app.get('/main', hasUser, function (req, res) {
    console.log(req.user);
    //if(req.user.name) return  res.send( "hellow: " +'<h1>'+req.user.name+'</h1>');
    // res.send(req.user);
    res.sendfile('public/main.html');

  });
  app.post('/main', hasUser, function (req, res) {
    console.log(req.body);
      var id = req.body._id;
      delete req.body._id;
    User.update({_id: id}, req.body, function (err, user) {
      res.json({success: !err, msg: [], data: user, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
    });


  });
}
module.exports = router;