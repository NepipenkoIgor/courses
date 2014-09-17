/**
 * Created by igor on 7/3/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');
var Notify = mongoose.model('Notify');
var Answers = mongoose.model('Answers');

function router(app, hasUser, io) {
    app.post('/comment/new', hasUser, function (req, res) {
        var istanceShem;
        if (req.body.action === "answer") {
            istanceShem = Answers;
        } else {
            istanceShem = Posts;
        }
        istanceShem.update({_id: req.body._id}, {$set: {comments: req.body.comments}}, function (err, num) {
            if (req.body.creator === req.body.creatorComment) {
                res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
                return;
            }
            Notify.find({user: req.body.creator}, function (err, data) {
                var notify;
                notify = {notifyId: Date.now(), type: "comment your post", creatorOfPost: req.body.creator, postId: req.body._id, creatorComment: req.body.creatorComment};
                if (req.body.typePost === "question") {
                    notify.type = "comment your question";
                }
                if (data.length > 0) {
                    Notify.update({user: req.body.creator}, {$push: {content: notify}}, function (num) {
                        io.sockets.emit("notify", notify);
                        res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
                    });
                    return;
                } else {
                    Notify.create({user: req.body.creator, content: [notify]}, function (num) {
                        io.sockets.emit("notify", notify);
                        res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
                    });
                    return;
                }

            });


        });

    });


    app.post('/comment/update', hasUser, function (req, res) {
        var istanceShem;
        if (req.body[1] === "answerNotComment") {
            istanceShem = Answers;
            istanceShem.update({_id: req.body[0]._id}, {$set: {content: req.body[0].content}}, function (err, num) {
                res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
            return;
        }
        if (req.body[1] === "answer") {
            istanceShem = Answers;

        }else {
            istanceShem = Posts;
        }
        istanceShem.update({_id: req.body[0]._id}, {$set: {comments: req.body[0].comments}}, function (err, num) {
            res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
        });
    });


}
module.exports = router;