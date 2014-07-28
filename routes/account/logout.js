/**
 * Created by Игорь on 19.06.2014.
 */
function router(app) {
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/#/welcome');
  });
}
module.exports=router;