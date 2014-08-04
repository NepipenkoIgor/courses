/**
 * Created by igor on 8/4/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');


function router(app, hasUser) {
    //'use strict'
    app.post('/post/search', hasUser, function (req, res) {

        if (req.body.type === 'All Posts') {
            Posts.find({}, function (err, data) {
                console.log("searchData", data)
                res.json({success: !err, msg: [], data: data, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
        if (req.body.type === 'My Posts') {
            Posts.find({creator: req.body.creator}, function (err, data) {
                console.log("searchData", data)
                res.json({success: !err, msg: [], data: data, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
        if (req.body.type === 'My Questions') {
            Posts.find({creator: req.body.creator,typePost:req.body.typePost}, function (err, data) {
                console.log("searchData", data)
                res.json({success: !err, msg: [], data: data, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
        if (req.body.type === 'Only Questions') {
            Posts.find({typePost:req.body.typePost}, function (err, data) {
                console.log("searchData", data)
                res.json({success: !err, msg: [], data: data, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
        if (req.body.type === 'tags') {
           Posts.find({"tags":req.body.tag},function(err,data){
                console.log("UNWINDDDDDD",data);
                res.json({success: !err, msg: [], data: data, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
        if (req.body.type === 'text') {
            console.log(req.body);
            Posts.find({$text:{ $search:req.body.text }},function(err,data){
                if(err) return err;
                console.log("text search",data);
                res.json({success: !err, msg: [], data: data, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
    });

}
module.exports = router;