/**
 * Created by igor on 8/4/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');

function router(app, hasUser) {
    //'use strict'
    app.post('/post/search', hasUser, function (req, res) {
        console.log(req.body.comments);
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
          /*  Posts.aggregate({$unwind:"$tags"},function(err,data){
                console.log("UNWINDDDDDD",data);
                var newData=[]
                for(var i=0;i<data.length;i++){
                   if(data[i].tags===req.body.tag){
                       var query={_id:data[i]._id};
                       newData.
                   }
                }
               // res.json({success: !err, msg: [], data: data, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });*/

            


        }
    });

}
module.exports = router;