/**
 * Created by igor on 7/2/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');

function router(app, hasUser) {
    'use strict'
    app.post('/post/delete', hasUser, function (req, res) {
console.log(req.body)

            // console.log("postNew", postNew);
            Posts.remove({"_id":req.body._id},function (err, post) {
                console.log(" post delete");
                //res.json({success: !err, msg: [], data: post, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
               // res.redirect("/#/post/all");
            });

        });

}
module.exports = router;