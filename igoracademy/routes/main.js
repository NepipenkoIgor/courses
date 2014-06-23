/**
 * Created by Игорь on 17.06.2014.
 */
function router(app, hasUser) {
  var User = app.get('User');
  app.get('/main', hasUser, function (req, res) {
    console.log(req.user);
    //if(req.user.name) return  res.send( "hellow: " +'<h1>'+req.user.name+'</h1>');
    // res.send(req.user);
    res.sendfile('public/main.html');

  });
  app.post('/main', hasUser, function (req, res) {
    console.log(req.body);
    User.update({_id: req.body._id}, req.body, function (err, user) {
      res.json({success: !err, msg: [], data: user, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
    });


  });
}
module.exports = router;