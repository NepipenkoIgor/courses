/**
 * Created by Игорь on 17.06.2014.
 */
var passport = require('passport');
var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var bcrypt = require('bcrypt-nodejs');
function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

function validatePassword(password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};


function router(app, hasAccess) {


    app.post('/true/code', function (req, res) {
        //console.log(req.body.code);
        if (req.body.code === "CSA109_FALL2014" || req.body.code === "PREVIEW2014") {
            res.json({success: true});
            return;
        }
        res.json({success: false});
        return;
    });


    app.post('/true/oldpass', function (req, res) {
        console.log(req.body.pass);
        Users.find({email: req.body.email}).select('+password').exec(function (err, data) {
            console.log(data)
            data[0].validatePassword(req.body.pass, function (err, isMatch) {
                console.log(isMatch)
                if (!isMatch) {
                    res.json({success: false});
                }
                res.json({success: true});
            });
        });

    });
    app.post('/set/new/password', function (req, res) {
      //  console.log(req.body)
        Users.update({email: req.body.email},{password:bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)},function (err, num) {
        console.log(num);
            Users.find({email: req.body.email},function(err,data){
                console.log(data)
                res.redirect("/#/profile/"+data[0].username);
            });
        });

    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/middlelogin', // redirect to the secure profile section
        failureRedirect: '/#/login' // redirect back to the signup page if there is an error
        // failureFlash : true // allow flash messages
    }));

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/#/dashboard', // redirect to the secure profile section
        failureRedirect: '/#/signup' // redirect back to the signup page if there is an error
        //failureFlash : true // allow flash messages
    }));
    app.post('/signup/admin', passport.authenticate('local-admin', {
        successRedirect: '/#/dashboard', // redirect to the secure profile section
        failureRedirect: '/#/login/admin' // redirect back to the signup page if there is an error
        //failureFlash : true // allow flash messages
    }));

   app.get("/middlelogin",function(req,res){
       console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",req.session)
       if(req.session.notify){
           var id=req.session.notify;
           req.session.notify=null;
           res.redirect('/#/post/all?type=notifypost&post='+id);

           return;
       }
       res.redirect('/#/dashboard');
   })
}
module.exports = router;
