/**
 * Created by Игорь on 17.06.2014.
 */
var mongoose = require('mongoose');
var Users = mongoose.model('Users');


function router(app,hasUser) {


  app.get('/user',hasUser ,function (req, res) {
    res.json(req.user);
  });
    app.get('/users',hasUser ,function (req, res) {
        Users.find({},function(err,data){
            res.json(data);
        })
        //

    });
}
module.exports=router;