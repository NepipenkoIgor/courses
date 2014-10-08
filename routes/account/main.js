/**
 * Created by Игорь on 17.06.2014.
 */

var mongoose = require('mongoose');
var User = mongoose.model('Users');
function router(app, hasUser, io) {

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
if(err){
    res.json({"succes":false})
    io.sockets.emit("error", {"text":"is not update"});
    return;
}
      //res.json({success: !err, msg: [], data: user, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
        if(req.body.profile){
            //res.redirect("/#/profile/"+req.body.profile);
            res.json({"succes":true})
            io.sockets.emit("success", {"text":"social info is update"});
            return;
        }

        //res.redirect("/#/settings?success=true");
        res.json({"succes":true})
        io.sockets.emit("success", {"text":"acount info is update"});

    });


  });
}
module.exports = router;