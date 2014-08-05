/**
 * Created by igor on 8/5/14.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var badgeSchema=new Schema({
    badgeId:Number,
    title:String,
    img:String
});

mongoose.model('Badges',badgeSchema);