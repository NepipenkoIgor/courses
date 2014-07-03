/**
 * Created by igor on 7/3/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');

function router(app, hasUser) {
    //'use strict'
    app.post('/comment/new', hasUser, function (req, res) {
        console.log(req.body.comments);

        Posts.update({_id: req.body._id}, {$set: {comments: req.body.comments}}, function(err, num) {
            res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
        });/*

        // console.log("postNew", postNew);
        Posts.update({"_id":req.body._id},{$set:{"comments":req.body.comments}},function (err, post) {
            console.log(" comment add");
            //res.json({success: !err, msg: [], data: post, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});

        });*/

    });

}
module.exports = router;