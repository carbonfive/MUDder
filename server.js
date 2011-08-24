var express = require('express'),
    ws = require('websocket-server'),
    world = require('./data.js');
var app = express.createServer()

app.get("/:user", function(request,response) { response.sendfile(__dirname + '/user.html'); } );
var wsServer = ws.createServer({server:app});

wsServer.addListener("connection", function(user){
  user.say = function(msg) { this.send( JSON.stringify({text:msg}) ) };
  user.room = world['red room'];
  user.say( user.room.description );
  user.addListener("message", function(msg){
    var command = JSON.parse(msg).text.split(/\s+/);
    world.command(command[0], command[1],user);
  });
});

app.listen(8500);

