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
  userlevel:Number,
  firstname:String,
  lastname:String,
  birth:Date,
  email:String,
  phone:String,
   position:Boolean,
  settings:Boolean,
  courses:[
      {id:String}
  ],
  progress:[]
});

mongoose.model('Users',userSchema);