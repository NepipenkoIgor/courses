/**
 * Created by Игорь on 17.06.2014.
 */

var mongoose = require('mongoose');
var User = mongoose.model('Users');
function router(app, hasUser) {

  app.post('/main', hasUser, function (req, res) {
    console.log(req.body);
      var id = req.body._id;
      delete req.body._id;
      var obj={}
      for(key in req.body){
          if(req.body[key]!==""){
            //  console.log(req.body[key])
              obj[key]=req.body[key]
          }

      }
    User.update({_id: id}, obj, function (err, user) {
      //res.json({success: !err, msg: [], data: user, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
        if(req.body.profile){
            res.redirect("/#/profile/"+req.body.profile);
            return;
        }
        res.redirect("/#/settings");
    });


  });
}
module.exports = router;