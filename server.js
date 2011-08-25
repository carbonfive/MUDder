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
  var description = world.prop(user.room,'describe')(user.room);
  user.say( description );
  user.addListener("message", function(msg){
    var command = JSON.parse(msg).text.split(/\s+/);
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

var replyCount = 0;

twit.stream('user', {replies:'all'}, function(stream) {
  stream.on('data', function (data) {
    console.log('Stream Data',data);

    if(data.user && data.text) {
      if (data.user.name != 'c5mudder') {
        twit.verifyCredentials(function (data) {
          console.log('Verify Credentials Data:', data);
            })
            .updateStatus("@" + data.user.name + " Thanks for the " + (replyCount++) + "th reply!",
                          function(data) {
                            console.log('Update Status Data', data);
                          });
      }
    }
  });
});
