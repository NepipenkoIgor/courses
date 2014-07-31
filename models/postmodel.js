/**
 * Created by igor on 7/1/14.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var postSchema=new Schema({
    title:String,
    creator:String,
    created:Date,
    lesson:Number,
    votes:[
        {creator:String},
        {vote:Number}
    ],
    favorites:String,
    content:String,
    tags:[],
    comments:[],
    likes:[],
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

mongoose.model('Posts',postSchema);