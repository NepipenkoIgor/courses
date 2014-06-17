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


var mongoose = app.get('config').mongoose
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('open', function () {
  console.log('iam connect test db');
});


app.listen(4000);
console.log("start server 4000");
