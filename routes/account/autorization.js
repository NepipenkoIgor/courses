/**
 * Created by Игорь on 17.06.2014.
 */
function router(app,hasAccess) {


  app.get('/',hasAccess,function (req, res) {
    //res.sendfile('public/indexOld.html');
      res.redirect('/#/dashboard');
  });
}
module.exports=router;