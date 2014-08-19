/**
 * Created by Игорь on 17.06.2014.
 */
var passport = require('passport');

function router(app,hasAccess) {


    app.post('/true/code',function(req,res){
        //console.log(req.body.code);
        if(req.body.code==="CSA109_FALL2014"||req.body.code==="PREVIEW2014"){
            res.json({success:true});
            return;
        }
        res.json({success:false});
        return;
    });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/#/dashboard', // redirect to the secure profile section
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



}
module.exports=router;
