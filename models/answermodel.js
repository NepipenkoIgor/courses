/**
 * Created by igor on 9/16/14.
 */
var mongoose=require('mongoose');
//var textSearch = require('mongoose-text-search');
var Schema=mongoose.Schema;
var answerSchema=new Schema({
    title:String,
    creator:String,
    postId:String,
    created:String,
    img:[],
    lesson:Number,
    votes:[],
    voteNum:Number,
    corectAnswer:Boolean,
    typePost:String,
    content:{type:String,index: true},
    comments:[],
    likes:[],
    likesNum:Number,
    replies:[
        {creator:String},
        {created:Date},
        {
            votes:[
                {creator:String},
                {vote:Number}
            ]
        },
        {favorites:String},
        {content:String},
        {
            comments:[
                {creator:String},
                {created:Date},
                {content:String}
            ]
        }
    ]
});
//postSchema.plugin(textSearch);
//postSchema.index({content:"text"});

mongoose.model('Answers',answerSchema);