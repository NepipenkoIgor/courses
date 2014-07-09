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
var stepShema=new Schema({

    stepName:String,
    typeStep:String,
    content:String
});


var moduleLessonSchema = new Schema({
    /*_subject:{ type: Number, ref: 'Person' }*/
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
           /* module:[]*/
        }]

});

var subjectSchema=new Schema({
    num:Number,
    menuName:String,
    color:Object,
    description:String,
    subjects:[subSubjectSchema]
});

mongoose.model('ModuleLesson',moduleLessonSchema,'moduleLesson');
mongoose.model('Subject',subjectSchema,'subject');
