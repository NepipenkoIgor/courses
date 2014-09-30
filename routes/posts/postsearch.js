/**
 * Created by igor on 8/4/14.
 */
var mongoose = require('mongoose');
var Posts = mongoose.model('Posts');


function router(app, hasUser, hasAccess) {
    //'use strict'
    app.post('/post/search', hasUser, function (req, res) {
        console.log(req.body)
        if (req.body.type === 'date') {
            Posts.find({}, function (err, data) {
                //console.log("searchData", data)
                var searchDateObj = [];
                var after = Date.parse(req.body.dateAfter);
                var before = Date.parse(req.body.dateBefore);
                for (var i = 0; i < data.length; i++) {
                    var postDate = Date.parse(data[i].created);
                    if (after < postDate && before > postDate) {
                        searchDateObj.push(data[i])
                    }
                }
               // console.log(searchDateObj)
                res.json({success: !err, msg: [], data: searchDateObj, type: req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
        }
        if (req.body.type === 'allposts') {
            Posts.find({}).sort({postId: -1}).exec(function (err, data) {
                //console.log("searchData", data)
                console.log("searchData", data)
                res.json({success: !err, msg: [], data: data, type: req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
            return
        }
        if (req.body.type === 'popular') {
            Posts.find({}).sort({likesNum: -1}).lean().exec(function (err, data) {
                console.log("searchData", data)

                //data=data;
                res.json({success: !err, msg: [], data: data, type: req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
            return
        }
        if (req.body.type === 'myposts') {
            Posts.find({creator: req.body.creator}).sort({postId: -1}).exec(function (err, data) {
                //console.log("searchData", data)
                res.json({success: !err, msg: [], data: data, type: req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
            return
        }
        if (req.body.type === 'onlyposts') {
            Posts.find({creator: req.body.creator}, function (err, data) {
                //console.log("searchData", data)
                var postMass = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].typePost === '') {
                        postMass.push(data[i]);
                    }

                }

                res.json({success: !err, msg: [], data: postMass, type: req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
            return
        }
        if (req.body.type === 'myquestions') {
            Posts.find({creator: req.body.creator, typePost: req.body.typePost}, function (err, data) {
                //console.log("searchData", data)
                res.json({success: !err, msg: [], data: data, type: req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
            return
        }
        if (req.body.type === 'questions') {
            Posts.find({typePost: req.body.typePost}, function (err, data) {
                // console.log("searchData", data)
                res.json({success: !err, msg: [], data: data, type: req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
            return
        }
        if (req.body.type === 'tags') {
            Posts.find({"tags": req.body.tag}, function (err, data) {
                console.log("UNWINDDDDDD", data);
                res.json({success: !err, msg: [], data: data, type: req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
            return
        }
        if (req.body.type === 'notifypost') {
            Posts.find({_id: req.body.post}, function (err, data) {
                //console.log("UNWINDDDDDD",data);
                res.json({success: !err, msg: [], data: data, type: req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
            return
        }
        if (req.body.type === 'text') {

            Posts.find({}, function (err, data) {

                var textSearch = req.body.text.split(" ");

                var strSerch = "";
                for (var i = 0; i < textSearch.length; i++) {
                    if (i !== (textSearch.length - 1)) {
                        strSerch = strSerch + textSearch[i] + '\\' + "s*";
                        continue;
                    }
                    strSerch = strSerch + textSearch[i];
                }
                var reg = new RegExp(strSerch);

                var resData = [];
                for (var i = 0; i < data.length; i++) {
                    if (reg.test(data[i].content) || reg.test(data[i].title)) {
                        resData.push(data[i]);
                        continue;
                    }
                    for (var j = 0; j < data[i].comments.length; j++) {
                        if (reg.test(data[i].comments[j].content)) {
                            resData.push(data[i]);
                            continue;
                        }
                    }
                }
                res.json({success: !err, msg: [], data: resData, type: req.body.type, error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
            });
            return
        }
        Posts.find({}).sort({postId: -1}).exec(function (err, data) {
            //console.log("searchData", data)
            console.log("searchData", data)
            res.json({success: !err, msg: [], data: data, type: "allposts", error: err, action: {type: 'redirect', location: '/url/asdfsdf'}});
        });
    });


    app.get('/post/all', hasUser, function (req, res) {
        var urlMass = req.url.split("?");
        if (urlMass[1]) {
            return;
        }
        res.redirect("/#/post/all");
    });

}
module.exports = router;