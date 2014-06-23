/**
 * Created by Игорь on 12.06.2014.
 */


var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var userSchema=new Schema({
  fid:Number,
  gid:Number,
  lid:Number,
  username:String,
  password:String,
  userlevel:String,
  firstname:String,
  lastname:String,
  birth:Date,
  email:String,
  phone:Number,
  preferences:String
});

module.exports=mongoose.model('Users',userSchema);