/**
 * Created by Игорь on 17.06.2014.
 */
function model(app) {
  var User =require('./usermodel');
    var Post =require('./postmodel');
  var  authConfig = require('./auth');
  app.set('authConfig',authConfig);
  app.set('User',User);
}
module.exports=model;