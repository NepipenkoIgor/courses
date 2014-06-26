'use strict';
var express=require('express');
var app=express();


// configuration
require('./config')(app);

// models
require('./models')(app);

//routes
require('./routes')(app);

//controller
require('./controller')(app);


var mongoose =require('mongoose');

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/test';
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('open', function () {
  console.log('iam connect test db');
});

var port = Number(process.env.PORT || 4000);
app.listen(port);
console.log("start server"+port);
console.log(process.env.GOOGLEID)
