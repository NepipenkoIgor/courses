/**
 * Created by igor on 7/4/14.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var stepShema=new Schema({
    stepName:String,
        type:String,
    content:String
});


var moduleLessonSchema = new Schema({
    moduleName:String,
    steps:[stepShema]

});

var subSubjectSchema = new Schema({
    subjectName:String,
    subjectImg:String,
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
    subjects:[subjectSchema]
                            });

mongoose.model('Subject',subjectSchema,'subject');

