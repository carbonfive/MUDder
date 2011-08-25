var express = require('express'),
    ws = require('websocket-server'),
    net = require('net'),
    twitter = require('twitter'),
    world = require('./data.js');
var app = express.createServer()

app.get("/:user", function(request,response) { response.sendfile(__dirname + '/user.html'); } );
var wsServer = ws.createServer({server:app});

wsServer.addListener("connection", function(user){
  user.say = function(msg) { this.send( JSON.stringify({text:msg}) ) };
  user.room = world['red room'];
  (world['red room'].players=world['red room'].players||[]).push(user);
  var description = world.prop(user.room,'describe')(user,user.room);
  user.say( description );
  user.addListener("message", function(msg){
    var data = JSON.parse(msg);
    user.name = data.name;
    var command = data.text.split(/\s+/);
    world.command(command[0], command[1],user);
  });
});

app.listen(8500);

var twit = new twitter({
  consumer_key: 'QLYnr2siu3su1urO6ucvbg',
  consumer_secret: 'q4nvQBygO92lZ8vKlpztL8LglXOBKPNLV4dyJ6Tuxw',
  access_token_key: '361542648-twuS2ovfDqAwqNLnS00bJTFtUxZ8tyM5VhIbA9Ag',
  access_token_secret: '7aIcwsgWjvUn2XNci27dcHabMlV1OoYI1LOzMMQ9AA'
});


var twitterUsers = {};
var replyCount = parseInt(Math.random()*1000);
var noop = function(data) {};
twit.stream('user', {replies:'all'}, function(stream) {
  stream.on('data', function (data) {
    console.log('Stream Data',data);

    if(data.user && data.text && data.text.match(/\@c5mudder(\s|$)/) ) {
      try {
        var userName = data.user.screen_name;
        var user = twitterUsers[userName];
        if ( user == null ) {
          user = twitterUsers[userName] = {
            say: function(msg) {
              twit.verifyCredentials(noop).updateStatus("@" + userName + ' [' + (replyCount++) + '] ' + msg, noop);
            },
            room : world['red room'],
            name : userName
          };
          (world['red room'].players=world['red room'].players||[]).push(user);
          var description = world.prop(user.room,'describe')(user,user.room);
          user.say( description );
        } else {
          var command = data.text.split(/\s+/).filter(function(t) { return t.charAt(0) != '@'; });
          world.command(command[0], command[1], user);
        }
      } catch (error) { console.log(error.message, error);  }
    }
  });
});
