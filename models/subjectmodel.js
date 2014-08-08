/**
 * Created by igor on 7/4/14.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var limShema=new Schema({

    title:String,
    typeLim:String,
    points:Number,
    content:[],
    order:String,
    complete:Boolean,
    awards:String,
    userrating:String
});


var unitSchema = new Schema({
    /*_subject:{ type: Number, ref: 'Person' }*/
    parent:{ type: Number, ref: 'Courses' },
    title:String,
    description:String,
    unitId:Number,
    lims:[limShema]

});

var modulesSchema = new Schema({
    title:String,
    description:String,
    map:Object,
    sections:[
        {
            specialId:Number,
            title:String,
            description:String
            /* module:[]*/
        }]

});

var subjectSchema=new Schema({
    num:Number,
    title:String,
    img:String,
    color:Object,
    description:String,
    modules:[modulesSchema]
});



mongoose.model('Units',unitSchema,'units');
mongoose.model('Courses',subjectSchema,'courses');
