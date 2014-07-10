/**
 * Created by igor on 7/4/14.
 */
var mongoose = require('mongoose');
var Subjects = mongoose.model('Subject');
var ModuleLesson =mongoose.model('ModuleLesson');

function router(app) {
    //'use strict'
    app.get('/subject', function (req, res) {

        Subjects.find({}, function (err, data) {
            console.log(data);
            res.json(data);
        });

    });
    app.get('/modulelesson', function (req, res) {

        ModuleLesson.find({}, function (err, data) {
            console.log(data);
            res.json(data);
        });

    });

    app.post('/subject', function (req, res) {

console.log(req.body);
        if(!req.body[0]._id){
            var subj=new Subjects(req.body[0]);
            subj.save(function(err,number){
                console.log(err, number);
                ModuleLesson.create(req.body[1],function(err,number){
                    console.log(err, number);
                    res.json({success:true,data:{id:subj._id}});
                });
        });

        }else{
            var saveId=req.body[0]._id;
            delete req.body[0]._id;
                    Subjects.update ({'_id':saveId},req.body[0],function(err,data){
                        var moduleId=[];
                        for(var i=0;i<req.body[1].length;i++){
                            if(moduleId.indexOf(req.body[1][i].parent)===(-1)){
                                moduleId.push(req.body[1][i].parent);
                                ModuleLesson.remove({parent:req.body[1][i].parent},function(err){
                                   // console.log(err);
                                });
                            }
                        };
                        ModuleLesson.create(req.body[1],function(err,number){
                            console.log(err, number);
                            res.json({success:true});
                        });
                    });
        };
    });
};
module.exports = router;