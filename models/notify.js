/**
 * Created by igor on 8/26/14.
 */
var mongoose=require('mongoose');
//var textSearch = require('mongoose-text-search');
var Schema=mongoose.Schema;
var notifySchema=new Schema({
    user:String,
    content:[]
});
mongoose.model('Notify',notifySchema);