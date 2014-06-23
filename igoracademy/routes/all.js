/**
 * Created by Игорь on 19.06.2014.
 */
function router(app) {
  app.get('*', function (req, res) {
    console.log(req.url);
    //if(req.user.name) return  res.send( "hellow: " +'<h1>'+req.user.name+'</h1>');
    // res.send(req.user);
    res.sendfile('public/'+req.url);

  });
}
module.exports=router;