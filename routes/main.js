/**
 * Created by Игорь on 17.06.2014.
 */
function router(app,hasUser) {
  app.get('/main', hasUser, function (req, res) {
    console.log(req.user);
    //if(req.user.name) return  res.send( "hellow: " +'<h1>'+req.user.name+'</h1>');
    res.send(req.user);

  });
}
module.exports=router;