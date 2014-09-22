/**
 * Created by igor on 9/22/14.
 */
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var crypto=require('crypto')
function route(app){
    app.post("/forgot",function(req,res){
        console.log(req.body);
        Users.find({email:req.body.email},function(err,data){
            console.log("nashol",data);
            if(!data[0]){
                res.redirect("/#/forgot");
                return;
            }
            crypto.randomBytes(20, function(ex, buf) {
                if (ex) throw ex;
                var token = buf.toString('hex');
                console.log("!!!!!!!!!!!!!!!!!!!!!",token)
                data[0].resetPasswordToken = token;
                data[0].resetPasswordExpires = Date.now() + 3600000;

                data[0].save(function(err){
                    console.log(err,"wer")

                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'codequestacademy@gmail.com',
                            pass: '07041986'
                        }
                    });
                    var ahref = "codequestacademy.herokuapp.com/reset/" +  data[0].resetPasswordToken;
                    var message='You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n';
                    var message2='If you did not request this, please ignore this email and your password will remain unchanged.\n';
                    var tagUrl = '<a href="' + "http://codequestacademy.herokuapp.com/reset/" +  data[0].resetPasswordToken + '">' + ahref + '</a>'
                    var mailOptions = {
                        from: 'codequestacademy@gmail.com', // sender address
                        to: req.body.email, // list of receivers
                        subject: 'codequestacademy password Reset', // Subject line
                        text: "", // plaintext body
                        html: '<p>' +message + '</p></br>'+tagUrl + '</br><p>' +message2 + '</p>' // html body
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Message sent: ' + info.response);
                            var mail=req.body.email.split("@")
                            var render='<body style="background-color:#1F2F3F "><h1 style="color:#ffffff;position:absolute;left: 0;top:0;right: 0;bottom: 0;height:37px;text-align: center;margin: auto 0 ">' +
                                'Message sent on your mail<br><a href="http://'+mail[1]+'">go to my mail page</a></h1></body>'
                            res.end(render);
                        }
                    });



                })
            });

        });
    });



    app.get('/reset/:token',function(req,res){
        Users.find({resetPasswordToken: req.params.token,resetPasswordExpires: { $gt: Date.now()}},function(err,data){
            //console.log(data)
            if(!data){
                res.redirect('/#/forgot');
                return;
            }
            var render='<body style="background-color:#1F2F3F "><div ng-hide="forgotView" class="">'+
               '<div class="login_form" style="color:#ffffff;position:absolute;left: 0;top:0;right: 0;bottom: 0;height:159px;width: 400px;text-align: center;margin: auto  ">'+
                    '<h3>Reset password</h3>'+
                    '<form action="/reset/'+req.params.token+'" method="post" class="ng-pristine ng-invalid ng-invalid-required">'+
                        '<input  class="form-control ng-pristine ng-invalid ng-invalid-required" name="password"  type="text" placeholder="New password"  autofocus=""'+
                'style="width:100%;color: #1f2f3f;padding: 8px 16px;font-size: 15px;">'+
                '<input  class="form-control ng-pristine ng-invalid ng-invalid-required" name="id"  type="hidden"   >'+
                            '<button class="btn btn-primary btn-block" type="submit"'+
                'style="background-color: #df691a;width:100%;border: none;padding: 15px;color:#fff;cursor:pointer">Update Password</button>'+
                        '</form>'+
                    '</div>'+
                '</div></body>';
           res.end(render);
        })
    })

    app.post('/reset/:token',function(req,res){
        Users.find({resetPasswordToken: req.params.token,resetPasswordExpires: { $gt: Date.now()}},function(err,data){
            if(!data){
                res.redirect('/#/forgot');
                return;
            }

            data[0].password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
            data[0].resetPasswordToken = undefined;
            data[0].resetPasswordExpires = undefined;

            data[0].save(function(err) {

                    res.redirect('/#/login');


            });

        })

    })
}

module.exports=route;