/**
 * Created by igor on 7/2/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');
var fs = require('fs');
function router(app, hasUser) {
    'use strict'
    function deleteImg(img, i, res) {
        var old = "public/" + img[i][0];
        fs.unlink(old, function (err) {
            old = "public/" + img[i][1];
            fs.unlink(old, function (err) {
                i++;
                if (i === img.length) {
                    res.json({success: !err, msg: [], data: "", error: err, action: {type: 'redirect', location: '/url/asdfsdf'}})
                    return;
                }
                deleteImg(img, i, res)

            });
        });
    }

    app.post('/post/delete', hasUser, function (req, res) {
        var i = 0;
        Posts.remove({"_id": req.body._id}, function (err, post) {
            if (req.body.img.length !== 0) {

                deleteImg(req.body.img, i, res);
            }
            res.json({success: !err, msg: [], data: post, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            //console.log(" post delete");

        });

    });


}
module.exports = router;