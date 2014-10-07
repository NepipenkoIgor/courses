/**
 * Created by igor on 8/26/14.
 */
var mongoose = require('mongoose');
var Notify = mongoose.model('Notify');
var nodemailer = require('nodemailer');
var Users = mongoose.model('Users');
var smtpTransport = require('nodemailer-smtp-transport');


function router(app, hasUser) {
    app.get('/user/notify', hasUser, function (req, res) {
        Notify.find(function (err, data) {
            res.json({data: data});
        });
    });
    app.post('/notify/delete', hasUser, function (req, res) {
        //console.log(req.body);
        Notify.update({user: req.body[0].creatorOfPost}, {$set: {content: req.body[1]}}, function (err, num) {
            res.json({data: num});
        });

    });
    app.post('/notify/delet/all', hasUser, function (req, res) {
        console.log("!!!!!!!!!!!!!!!!!",req.body);
        Notify.remove({user: req.body.id},function (err, num) {
            res.json({data: num});
        });

    });
    app.post("/notify/send/mail", hasUser, function (req, res) {
        //console.log(req.body)
        Users.find({position: true}, function (err, mass) {
            var admins = [];
            for (var i = 0; i < mass.length; i++) {
                admins.push(mass[i].email);
            }

            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'codequestacademy@gmail.com',
                    pass: '07041986'
                }
            });
            var ahref = "codequestacademy.herokuapp.com/#/post/all?type=notifypost&post=" + req.body[0]._id;
            http://localhost:4000/#/post/all?type=notifypost&post=541c17d764f6efc20b8a1565
                /* var tagUrl = '<a href="' + "http://localhost:4000/#/post/all?type=notifypost&post=" + req.body[0]._id + '">' + ahref + '</a>';*/
                var tagUrl = '<a href="' + "http://codequestacademy.herokuapp.com/redirect/from/mail/" + req.body[0]._id + '">' + ahref + '</a>';
            var mailOptions = {
                from: 'codequestacademy@gmail.com', // sender address
                to: admins.join(), // list of receivers
                subject: 'flaged post ✔', // Subject line
                text: "", // plaintext body
                html: tagUrl + '</br><p>' + req.body[1].content + '</p>' // html body
            };

// send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {

                } else {

                    res.json({});
                }
            });
        });
    });

    app.get("/redirect/from/mail/:id", function (req, res) {

        var id = req.url.split("/")[4];
        if (req.session.passport.user) {
            res.redirect('/#/post/all?type=notifypost&post=' + id);
            return;
        }
        req.session.notify = id;

        res.redirect('/#/login');
    });
}
module.exports = router;