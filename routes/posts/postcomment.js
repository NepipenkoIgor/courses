/**
 * Created by igor on 7/3/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');
var Notify = mongoose.model('Notify');

function router(app, hasUser,io) {
    app.post('/comment/new', hasUser, function (req, res) {
        Posts.update({_id: req.body._id}, {$set: {comments: req.body.comments}}, function(err, num) {

            Notify.find({user:req.body.creator},function(err,data){
                var notify;
                notify={notifyId:Date.now(),type:"comment your post",creatorOfPost:req.body.creator,postId:req.body._id,creatorComment:req.body.creatorComment};
                if(req.body.typePost==="question"){
                    notify.type="comment your question";
                }
               if(data.length>0){
                    Notify.update({user:req.body.creator},{$push: {content:notify}},function(num){
                        io.sockets.emit("notify",notify);
                        res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
                    });
                    return;
                }else{
                   Notify.create({user:req.body.creator,content:[notify]},function(num){
                       io.sockets.emit("notify",notify);
                       res.json({success: !err, msg: [], data: num, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
                   });
                   return;
               }

            });


        });

    });

}
module.exports = router;