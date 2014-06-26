/**
 * Created by Игорь on 17.06.2014.
 */
function router(app,hasUser) {


  app.get('/user',hasUser ,function (req, res) {
    res.json(req.user);
  });
}
module.exports=router;