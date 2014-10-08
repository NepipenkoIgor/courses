/**
 * Created by Игорь on 17.06.2014.
 */
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var Badges=mongoose.model('Badges');
var fs =require('fs');




function router(app,hasUser,io) {
    app.post('/user/upload',hasUser,function (req, res) {
       console.log(req.files,'req.body',req.user);
       // console.log(req.files)
        var type=req.files.userfile.type;
        if(req.files.userfile.size===0||!(type !== "image/png" || type !== "image/jpeg" || type !== "image/gif")){
            res.json({});
            return;
        }
        if(req.user.avatar){
            var old="public/"+req.user.avatar;
            console.log(old);
            fs.unlink(old,function(err) {
                fs.createReadStream(req.files.userfile.path)
                    .pipe(fs.createWriteStream("public/img/user/avatar/" + req.files.userfile.originalFilename))
                    .on('finish', function () {
                        Users.update({_id: req.user._id}, {avatar: "img/user/avatar/" + req.files.userfile.originalFilename}, function (num) {
                           // res.redirect("/#/profile/" + req.user.username);
                            res.json({a:"B"})
                            io.sockets.emit("success", {"text":"user avatar is update"});
                        });
                    });
            });
            return;
        }
        fs.createReadStream(req.files.userfile.path)
            .pipe(fs.createWriteStream("public/img/user/avatar/" + req.files.userfile.originalFilename))
            .on('finish', function () {
                Users.update({_id: req.user._id}, {avatar: "img/user/avatar/" + req.files.userfile.originalFilename}, function (num) {
                    res.json({a:"B"})
                    //res.json({a:"B"});
                    io.sockets.emit("success", {"text":"user avatar is update"});
                });
            });
    });

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
        });

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
        //console.log(req.body);
        Users.update({_id:req.body[0]},{$push:{badges:req.body[1]}},function(err,num){
            res.json(num);
        });

    });


    app.post("/curentlesson",function(req,res){
        //console.log(req.body)
        Users.update({_id:req.body.id},{currentLesson:{unit:req.body.unit,specialId:req.body.specialId,courseId:req.body.courseId,moduleId:req.body.moduleId,
        title:req.body.title,position:req.body.position}},function(err,num){
            res.json(num);
        });
    });
    app.post("/delete/oldunit",function(req,res){
        console.log("!!!!!",req.body)
        Users.update({_id:req.body[0]},{progress:req.body[1],currentLesson:req.body[2]},function(err,num){
            res.json(num);
        });
    });



}
module.exports=router;