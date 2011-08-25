var data = module.exports = {
  direction : {
    go : function( direction, user, room ) {
      if (user.room.players)
        user.room.players = user.room.players.filter(function(p) { return p.name !== user.name; });
      user.room = data[direction.goes];
      (user.room.players=user.room.players||[]).push(user);
      var description = prop(user.room,'describe')(user,user.room);
      user.say( description );
    }
  },
  room : {
    describe : function(user,room) {
      var description = room.description;
      if ( room.players && room.players.length ) 
        description += ' ' + room.players.filter(function(p){return p!=user;}).map(function(p){return '@'+p.name+' is here.';}).join(' ');
      return description;
    }
  },
  monster : {
    fight : function( monster, user, room, propName ) {
      delete room[propName];
      user.say( 'you have defeated the ' + prop(monster,'type') );
    }
  },
  'red room' : {
    _is : ['room'],
    description : "This is a red room.",
    north : { _is : ['direction'], goes: 'yellow room' }
  },
  'yellow room' : {
    _is : ['room'],
    describe : function(user,room) {
      var description = room.description;
      if ( room.players && room.players.length ) 
        description += ' ' + room.players.filter(function(p){return p!=user;}).map(function(p){return '@'+p.name+' is here.';}).join(' ');
      description += (room.orc ? ' There is an orc here' : '');
      return description;
    },
    description : "This is a yellow room.",
    south : { _is : ['direction'], goes: 'red room' },
    orc : {
      _is : ['monster'],
      type : 'orc'
    }
  }

}

var isA = module.exports.isA = function(obj,type) {
  return (obj._is||[]).filter(function(t) {return type==t;}).length > 0;
}

var prop = module.exports.prop = function(obj,name) {
  if ( obj[name] ) return obj[name];
  var types = (obj._is||[]).reverse();
  for (var i=0,l=types.length; i <l; i++)
    if ( data[types[i]][name] ) return data[types[i]][name];
  return null;
}

var command = module.exports.command = function(action,object,user) {
  var roomObject = prop(user.room, object);
  if ( ! roomObject )
    return user.say("There is no " + object + " here.");
  var command = prop(roomObject,action);
  if ( ! command ) 
    return user.say("You can't "+action+" "+object);
  command.apply(roomObject, [roomObject, user, user.room, object]);
}
