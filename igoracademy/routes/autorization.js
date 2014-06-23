/**
 * Created by Игорь on 17.06.2014.
 */
function router(app) {


  app.get('/' ,function (req, res) {
    res.sendfile('public/index.html');
  });
}
module.exports=router;