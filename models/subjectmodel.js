/**
 * Created by igor on 7/4/14.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

/*var stepShema=new Schema({
    stepName:String,
    type:{type: String},
    content:String
});


var moduleLessonSchema = new Schema({
    moduleName:String,
    description:String,
    steps:[stepShema]

});

var subSubjectSchema = new Schema({
    subjectName:String,
    subjectImg:String,
    description:String,
    subSubjects:[
        {
            subSubjectName:String,
            description:String,
            module:[moduleLessonSchema]
        }]

});

var subjectSchema=new Schema({
    num:Number,
    menuName:String,
    color:Object,
    description:String,
    subjects:[subSubjectSchema]
                            });*/
/*
var stepShema=new Schema({

    stepName:String,
    typeStep:String,
    content:String
});


var moduleLessonSchema = new Schema({
    //_subject:{ type: Number, ref: 'Person' }
    parent:{ type: Number, ref: 'Subject' },
    moduleName:String,
    description:String,
    steps:[stepShema]

});

var subSubjectSchema = new Schema({
    subjectName:String,
    subjectImg:String,
    description:String,
    subSubjects:[
        {
            specialId:Number,
            subSubjectName:String,
            description:String,
          // module:[]
        }]

});

var subjectSchema=new Schema({
    num:Number,
    menuName:String,
    color:Object,
    description:String,
    subjects:[subSubjectSchema]
});*/


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
    color:Object,
    description:String,
    modules:[modulesSchema]
});



mongoose.model('Units',unitSchema,'units');
mongoose.model('Courses',subjectSchema,'courses');
