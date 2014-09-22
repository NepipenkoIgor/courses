/**
 * Created by igor on 7/2/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');
var fs=require('fs');
function router(app, hasUser) {
    'use strict'
    app.post('/post/delete', hasUser, function (req, res) {
            Posts.remove({"_id":req.body._id},function (err, post) {
                if(req.body.img){
                    var old="public/"+req.body.img[0][0];
                    fs.unlink(old,function(err){
                        old="public/"+req.body.img[0][1];
                        fs.unlink(old,function(err){
                            res.json({success: !err, msg: [], data: post, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
                        });
                    });
                    return;
                }
                res.json({success: !err, msg: [], data: post, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
                console.log(" post delete");
                //res.json({success: !err, msg: [], data: post, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
               // res.redirect("/#/post/all");
            });

        });


}
module.exports = router;