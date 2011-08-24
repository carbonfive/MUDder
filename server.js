var express = require('express'),
    ws = require('websocket-server');

var app = express.createServer()

app.get("/:user", function(request,response) { response.sendfile(__dirname + '/user.html'); } );
var wsServer = ws.createServer({server:app});

wsServer.addListener("connection", function(socket){
  socket.addListener("message", function(msg){
    msg = JSON.parse(msg);
    socket.send( JSON.stringify({text:msg.name + " sez " + msg.text}) );
  });
});

app.listen(8500);

