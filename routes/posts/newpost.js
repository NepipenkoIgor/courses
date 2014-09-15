/**
 * Created by igor on 7/2/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');
var Notify = mongoose.model('Notify');
var fs = require('fs')
function dataReg(data) {
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var newDataDate = data.getDate();
    var newDataMonth = monthNames[data.getMonth()];
    var newDataYear = data.getFullYear();
    return newDataDate + " " + newDataMonth + " " + newDataYear;
}
function router(app, hasUser, io) {
    'use strict'
    app.post('/post/new', hasUser, function (req, res) {
        console.log(req.body);
        var newData = new Date();


        Posts.count(function (err, count) {

            var Post = new Posts;
            Post.id = count;
            Post.title = req.body.title;
            Post.content = req.body.content;
            Post.creator = req.body.creator;
            Post.created = dataReg(newData);
            Post.lesson = req.body.unit;
            Post.typePost = req.body.typePost || "";
            Post.postId = Date.now();

            Post.tags = req.body.tags;
            // console.log("postNew", postNew);
            Post.save(function (err, post) {
                console.log("good new post");
                res.json({success: !err, msg: [], data: post, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});

            });

        });


    });
    var count = 0
    app.post('/posts/upload', hasUser, function (req, res) {

        if (!req.files.postFile) {
            res.json({a: "B"})
            return;
        }
        var type = req.files.postFile.type;
        if (req.files.postFile.size === 0 || !(type !== "image/png" || type !== "image/jpeg" || type !== "image/gif")) {
            res.json({});
            return;
        }
        fs.createReadStream(req.files.postFile.path)
            .pipe(fs.createWriteStream("public/img/posts/" + req.files.postFile.originalFilename))
            .on('finish', function () {
                Posts.update({postId: req.headers.postid}, {$push: {img: "img/posts/" + req.files.postFile.originalFilename}}, function (err,num) {
                    console.log("!!!!!!!!",count,err,num)
                    count++
                    res.json({a: "B"});
                    return;
                });
            });

    });


    app.get('/posts', hasUser, function (req, res) {
        Posts.find(function (err, posts) {
            res.json(posts);
        });
    });
    app.post('/commentlikes', hasUser, function (req, res) {

        console.log(req.body)
        Posts.update({_id: req.body[0]._id}, {$set: {comments: req.body[0].comments}}, function (err, num) {
            if (req.body[3]) {
                if (req.body[1] === req.body[2]) {
                    res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
                    return;
                }
                Notify.find({user: req.body[1]}, function (err, data) {
                    var notify;
                    notify = {notifyId: Date.now(), type: "+1 your comment", creatorOfPost: req.body[1], postId: req.body[0]._id,
                        creatorComment: req.body[2], notify: "comment"};
                    if (data.length > 0) {
                        Notify.update({user: req.body[1]}, {$push: {content: notify}}, function (num) {
                            io.sockets.emit("notify", notify);
                            console.log(notify)
                            res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
                        });
                        return;
                    } else {
                        Notify.create({user: req.body[1], content: [notify]}, function (num) {
                            io.sockets.emit("notify", notify);
                            res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
                        });
                        return;
                    }

                });
            } else {

            }

        })


    })
    app.post('/postslikes', hasUser, function (req, res) {
        console.log("ASDASD", req.body);
        Posts.update({_id: req.body._id}, {$set: {likes: req.body.likes, likesNum: req.body.likesNum}}, function (err, num) {
            if (req.body.post) {
                if (req.body.post.creator === req.body.userHowLike) {
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