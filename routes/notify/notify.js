/**
 * Created by igor on 8/26/14.
 */
var mongoose = require('mongoose');
var Notify = mongoose.model('Notify');

function router(app, hasUser) {
    app.get('/user/notify', hasUser, function (req, res) {
        Notify.find(function(err,data){
            res.json({data:data});
        });
    });
    app.post('/notify/delete', hasUser, function (req, res) {
        //console.log(req.body);
        Notify.update({user:req.body[0].creatorOfPost},{$set:{content:req.body[1]}},function(err,num){
            res.json({data:num});
        });

    });
}
module.exports = router;