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
    regCode:String,
  password:String,
  userlevel:Number,
  firstname:String,
  avatar:String,
  lastname:String,
  birth:Date,
  dataReg:String,
  email:String,
  phone:String,
  position:Boolean,
  settings:Boolean,
  courses:[
      {id:String}
  ],
  progress:[],
    badges:[]
});

mongoose.model('Users',userSchema);