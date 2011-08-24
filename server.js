var express = require('express'),
    ws = require('websocket-server'),
    net = require('net'),
    TwitterNode = require('twitter-node').TwitterNode,
    world = require('./data.js');
var app = express.createServer()

app.get("/:user", function(request,response) { response.sendfile(__dirname + '/user.html'); } );
var wsServer = ws.createServer({server:app});

wsServer.addListener("connection", function(user){
  user.say = function(msg) { this.send( JSON.stringify({text:msg}) ) };
  user.room = world['red room'];
  var description = world.prop(user.room,'describe')(user.room);
  user.say( description );
  user.addListener("message", function(msg){
    var command = JSON.parse(msg).text.split(/\s+/);
    world.command(command[0], command[1],user);
  });
});

app.listen(8500);

var twit = new TwitterNode({
  user: 'c5mudder', 
  password: 'k!11f00z13',
  track : ['@c5mudder']
});

twit.headers['User-Agent'] = 'mudder';

twit.addListener('error', function(error) {
  console.log(error.message);
});

twit.addListener('tweet', function(tweet) {
  console.log("@" + tweet.user.screen_name + ": " + tweet.text);
});

twit.stream();
