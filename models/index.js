/**
 * Created by Игорь on 17.06.2014.
 */
function model(app) {
  var User =require('./usermodel');
    var Post =require('./postmodel');
    var Subject =require('./subjectmodel');
    var Badges =require('./badgesmodel');
    var Notify =require('./notify');
    var Answer =require('./answermodel');
  /*var  authConfig = require('./auth');
  app.set('authConfig',authConfig);
  app.set('User',User);*/
}
module.exports=model;