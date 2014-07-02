/**
 * Created by igor on 7/2/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');

function router(app, hasUser) {
    'use strict'
    app.post('/post/new', hasUser, function (req, res) {
       Posts.count(function(err,count){
           console.log("doc in base",count);
           var Post = new Posts;
           Post.id=count;
           Post.title=req.body.title;
           Post.content=req.body.content;
           var tags=req.body.tags.split(",");
           var resTags=[]
           for(var i=0;i<tags.length;i++){
               if(resTags.indexOf(tags[i])===(-1)){
                   resTags.push(tags[i]);
               }
           }
           Post.tags=resTags;
           // console.log("postNew", postNew);
           Post.save(function (err, post) {
               console.log("good new post");
               //res.json({success: !err, msg: [], data: post, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
               res.redirect("/#/post/all");
           });

       });



    });
    app.get('/posts',hasUser ,function (req, res) {
        Posts.find(function (err, posts) {
            res.json(posts);
        });
    });

    /*app.get('/post/new/*',hasUser ,function (req, res) {
        res.redirect("#/post/all");
    });*/



}
module.exports = router;