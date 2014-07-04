/**
 * Created by igor on 7/4/14.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var userSchema=new Schema({
    num:Number,
    menuName:String,
    color:Object,
    subjects:[String]
});

mongoose.model('Subject',userSchema,'subject');

