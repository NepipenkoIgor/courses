/**
 * Created by Игорь on 17.06.2014.
 */
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var Badges=mongoose.model('Badges');

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

    app.post('/true/email',function(req,res){
        console.log(req.body.email);
        Users.find({email:req.body.email},function(err,data){
            res.json(data);
        })
       // res.json({data:req.body.email});
    });

    app.post('/progress',hasUser ,function (req, res) {
        console.log(req.body);
        Users.update({_id:req.body[0]},{$push:{progress:req.body[1]}},function(err,num){
            res.json(num);
        })
    });
    app.get('/badges',hasUser ,function (req, res) {
        Badges.find({},function(err,data){
            res.json(data);
        })
    });

    app.post('/badgeuser',hasUser ,function (req, res) {
        console.log(req.body);
        Users.update({_id:req.body[0]},{$push:{badges:req.body[1]}},function(err,num){
            res.json(num);
        })

    });

}
module.exports=router;