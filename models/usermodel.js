/**
 * Created by Игорь on 12.06.2014.
 */

var bcrypt = require('bcrypt-nodejs');

var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var userSchema=new Schema({
  fid:Number,
  gid:Number,
  lid:{ type: Number, select: false },
  username:String,
    regCode:{ type: String, select: false },
  password:{ type: String, select: false },
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

// hash for User's password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// validate password of User
userSchema.methods.validatePassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};


mongoose.model('Users',userSchema);