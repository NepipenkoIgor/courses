/**
 * Created by igor on 7/1/14.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var postSchema=new Schema({
    title:Number,
    creator:Number,
    created:Number,
    votes:[
        {creator:String},
        {vote:Number}
    ],
    favorites:String,
    content:Number,
    tags:[],
    comments:[
        {creator:String},
        {created:Date},
        {content:String}
    ],
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

mongoose.model('Post',postSchema);