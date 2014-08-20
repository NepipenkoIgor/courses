/**
 * Created by igor on 7/2/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');
function dataReg(data){
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var newDataDate = data.getDate();
    var newDataMonth = monthNames[data.getMonth()];
    var newDataYear = data.getFullYear();
    return newDataDate + " " + newDataMonth + " " + newDataYear;
}
function router(app, hasUser) {
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
           if(req.body.tags){

               var tags=req.body.tags.split(",");
               var resTags=[];
               for(var i=0;i<tags.length;i++){
                   console.log(tags[i]);
                   if(resTags.indexOf(tags[i])===(-1)&&tags[i]!==""){
                       resTags.push(tags[i]);
                   }
               }
           }
           Post.tags=resTags||null;
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
        console.log(req.body);
       Posts.update({_id:req.body._id},{$set:{likes:req.body.likes}},function (err, num) {
            res.json(num);
        });
    });

    /*app.get('/post/new/*',hasUser ,function (req, res) {
        res.redirect("#/post/all");
    });*/



}
module.exports = router;