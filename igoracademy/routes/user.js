/**
 * Created by Игорь on 17.06.2014.
 */
function router(app,hasUser) {


  app.get('/user',hasUser ,function (req, res) {
    console.log();
    res.json(req.user);
  });
}
module.exports=router;