/**
 * Created by igor on 7/2/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');
var Notify = mongoose.model('Notify');
function dataReg(data){
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var newDataDate = data.getDate();
    var newDataMonth = monthNames[data.getMonth()];
    var newDataYear = data.getFullYear();
    return newDataDate + " " + newDataMonth + " " + newDataYear;
}
function router(app, hasUser,io) {
    'use strict'
    app.post('/post/new', hasUser, function (req, res) {
        console.log(req.body);
        var newData = new Date();


       Posts.count(function(err,count){
           console.log("doc in base",count);
           var Post = new Posts;
           Post.id=count;
           Post.title=req.body.title;
           Post.content=req.body.content;
           Post.creator=req.body.creator;
           Post.created=dataReg(newData);
           Post.lesson=req.body.unit;
           Post.typePost=req.body.typePost||"";
           Post.postId=Date.now();
           /*if(req.body.tags){

               var tags=req.body.tags.split(",");
               var resTags=[];
               for(var i=0;i<tags.length;i++){
                   console.log(tags[i]);
                   if(resTags.indexOf(tags[i])===(-1)&&tags[i]!==""){
                       resTags.push(tags[i]);
                   }
               }
           }
           Post.tags=resTags||null;*/
           Post.tags=req.body.tags;
           // console.log("postNew", postNew);
           Post.save(function (err, post) {
               console.log("good new post");
               res.json({success: !err, msg: [], data: post, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
               //res.redirect("/#/post/all");
           });

       });



    });
    app.get('/posts',hasUser ,function (req, res) {
        Posts.find(function (err, posts) {
            res.json(posts);
        });
    });
    app.post('/postslikes',hasUser ,function (req, res) {
        console.log(req.body.userHowLike);
       Posts.update({_id:req.body._id},{$set:{likes:req.body.likes,likesNum:req.body.likesNum}},function (err, num) {
if(req.body.post){
    if(req.body.creator===req.body.userHowLike){
        res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
        return;
    }
           Notify.find({user: req.body.post.creator}, function (err, data) {
               var notify;
               notify = {notifyId: Date.now(), type: "+1 your post", creatorOfPost: req.body.post.creator, postId: req.body._id, creatorComment: req.body.userHowLike};
               if (req.body.post.typePost === "question") {
                   notify.type = "+1 your question";
               }
               if (data.length > 0) {
                   Notify.update({user: req.body.post.creator}, {$push: {content: notify}}, function (num) {
                       io.sockets.emit("notify", notify);
                       res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
                   });
                   return;
               } else {
                   Notify.create({user: req.body.post.creator, content: [notify]}, function (num) {
                       io.sockets.emit("notify", notify);
                       res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
                   });
                   return;
               }

           });
       }

        });
    });







}
module.exports = router;