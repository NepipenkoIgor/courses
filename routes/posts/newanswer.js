/**
 * Created by igor on 9/16/14.
 */
var mongoose = require('mongoose');
var Answers = mongoose.model('Answers');
var Notify = mongoose.model('Notify');
var fs = require('fs')
function dataReg(data) {
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    var newDataDate = data.getDate();
    var newDataMonth = monthNames[data.getMonth()];
    var newDataYear = data.getFullYear();
    return newDataDate + " " + newDataMonth + " " + newDataYear;
}
function router(app, hasUser) {

    app.post("/answer/new", hasUser, function (req, res) {
        console.log(req.body);
        var newData=new Date();
        var Answer = new Answers;
        Answer.creator = req.body.creatorAnswer;
        Answer.postId = req.body.postAnswered;
        Answer.content = req.body.content;
        Answer.created = dataReg(newData);
        Answer.save(function (err, num) {
            console.log("goood")
            res.json({data: num});

        });
    });

    app.get("/answers", hasUser, function (req, res) {
        Answers.find({}, function (err, data) {
            console.log(err,data);
            res.json({data: data});
        });

    });


    app.post("/answer/check",hasUser,function(req,res){
        Answers.update({_id:req.body.answerChecked},{corectAnswer:true},function(err,num){
            res.json({data:num});
        });
    });

    app.post("/answer/vote",hasUser,function(req,res){


        Answers.find({_id:req.body.answerId},function(err,data){
            var voteNum=0;
            if(data[0].voteNum){
                voteNum=data[0].voteNum;
            }
            if(req.body.action==="up"){
                voteNum++;
            }
            if(req.body.action==="down"){
                voteNum--;
            }
            Answers.update({_id:req.body.answerId},{$push:{votes:req.body.whoVote},voteNum:voteNum},function(err,num){
                res.json({data:num});
            });
        });
    });

}
module.exports = router