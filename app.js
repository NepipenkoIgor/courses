'use strict';
var express=require('express');
var app=express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

require('./Gruntfile.js');
// configuration
require('./config')(app);

// models
require('./models')(app);

//routes
require('./routes')(app,io);

//controller
require('./controller')(app);






//server.listen(80);



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
server.listen(port);
console.log("start server"+port);

io.on("connection",function(socket){
    socket.emit("notify",{hellow:"client"});
    socket.on('my other event', function (data) {
        console.log(data);
    });
})