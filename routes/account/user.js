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
    app.post('/progress',hasUser ,function (req, res) {
        console.log(req.body);
        Users.update({_id:req.body[0]},{$push:{progress:req.body[1]}},function(err,num){
            res.json(num);
        })
        //

    });


}
module.exports=router;