/**
 * Created by igor on 8/4/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');


function router(app, hasUser) {
    //'use strict'
    app.post('/post/search', hasUser, function (req, res) {
console.log(req.body)
        if (req.body.type === 'allposts') {
            Posts.find({}, function (err, data) {
                //console.log("searchData", data)
                res.json({success: !err, msg: [], data: data,type:req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
        if (req.body.type === 'myposts') {
            Posts.find({creator: req.body.creator}, function (err, data) {
                //console.log("searchData", data)
                res.json({success: !err, msg: [], data: data,type:req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
        if (req.body.type === 'onlyposts') {
            Posts.find({creator: req.body.creator}, function (err, data) {
                //console.log("searchData", data)
                var postMass=[];
                for(var i=0;i<data.length;i++){
                  if(data[i].typePost===''){
                      postMass.push(data[i]);
                    }

                }

                res.json({success: !err, msg: [], data: postMass,type:req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
        if (req.body.type === 'myquestions') {
            Posts.find({creator: req.body.creator,typePost:req.body.typePost}, function (err, data) {
                //console.log("searchData", data)
                res.json({success: !err, msg: [], data: data,type:req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
        if (req.body.type === 'questions') {
            Posts.find({typePost:req.body.typePost}, function (err, data) {
               // console.log("searchData", data)
                res.json({success: !err, msg: [], data: data,type:req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
        if (req.body.type === 'tags') {
           Posts.find({"tags":req.body.tag},function(err,data){
                //console.log("UNWINDDDDDD",data);
                res.json({success: !err, msg: [], data: data,type:req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
        if (req.body.type === 'text') {
            //console.log(req.body);
            /*Posts.find({$text:{ $search:req.body.text }},function(err,data){
                res.json({success: !err, msg: [], data: data,type:req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });*/
            Posts.find({},function(err,data){
                //console.log("req.body.text",req.body.text)
                var textSearch=req.body.text.split(" ");
               // console.log(textSearch)
                var strSerch="";
                for(var i=0;i<textSearch.length;i++){
                    if(i!==(textSearch.length-1)){
                        strSerch=strSerch+textSearch[i]+'\\'+"s*";
                        continue;
                    }
                    strSerch=strSerch+textSearch[i];
                }
                var reg=new RegExp(strSerch);

                var  resData=[];
                for(var i=0;i<data.length;i++){
                    if(reg.test(data[i].content)||reg.test(data[i].title)){
                        resData.push(data[i]);
                        continue;
                    }
                    for(var j=0;j<data[i].comments.length;j++){
                        if(reg.test(data[i].comments[j].content)){
                            resData.push(data[i]);
                            continue;
                        }
                    }
                }
                res.json({success: !err, msg: [], data: resData,type:req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
    });
  app.get('/post/all', hasUser, function (req, res) {
      var urlMass=req.url.split("?");
      if(urlMass[1]){
console.log(urlMass[1]);
          return;
      }
      res.redirect("/#/post/all");
  });

}
module.exports = router;