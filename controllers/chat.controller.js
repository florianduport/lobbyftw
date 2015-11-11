'use strict'
var clientSockets = {};
var maxChannelHistory = 300;
var chat = {
  channels : {
    "général" : {
      id : 0,
      messages : [{
        channelId : 0,
        date : new Date(),
        displayDate : "00:00",
        messages : ["Bonjour et bienvenue sur NeedLast.com !"],
        user : {
          name : "Bot",
          profile : "#",
          username : "Bot",
          avatar : {
            small : "/images/csgo-logo.png",
            medium : "/images/csgo-logo.png"
          }
        }
      }]
    },
    "room 1" : {
      id : 1,
      messages : [{
        channelId : 0,
        date : new Date(),
        displayDate : "00:00",
        messages : ["Bonjour et bienvenue sur NeedLast.com !"],
        user : {
          name : "Bot",
          profile : "#",
          username : "Bot",
          avatar : {
            small : "/images/csgo-logo.png",
            medium : "/images/csgo-logo.png"
          }
        }
      }]
    },
    "room 2" : {
      id : 2,
      messages : [{
        channelId : 0,
        date : new Date(),
        displayDate : "00:00",
        messages : ["Bonjour et bienvenue sur NeedLast.com !"],
        user : {
          name : "Bot",
          profile : "#",
          username : "Bot",
          avatar : {
            small : "/images/csgo-logo.png",
            medium : "/images/csgo-logo.png"
          }
        }
      }]
    },
    "room 3" : {
      id : 3,
      messages : [{
        channelId : 0,
        date : new Date(),
        displayDate : "00:00",
        messages : ["Bonjour et bienvenue sur NeedLast.com !"],
        user : {
          name : "Bot",
          profile : "#",
          username : "Bot",
          avatar : {
            small : "/images/csgo-logo.png",
            medium : "/images/csgo-logo.png"
          }
        }
      }]
    }
  },
  users : []
};

if(global.redis !== undefined){

  global.redis.get('chat', function(err, chatRedis){
    if(!err && chatRedis !== undefined && chatRedis !== null)
      chat = JSON.parse(chatRedis);
  });
  /*global.redis.get('clientSockets', function(err, clientSocketsRedis){
    if(!err && clientSocketsRedis !== undefined && clientSocketsRedis !== null)
      clientSockets = JSON.parse(clientSocketsRedis);
  });*/
}

class ChatController {
  cleanSockets(){
    //todo => suppr disconnected sockets
  }
  updateMessages(socket, data){
    console.log(data);
    var currentPseudo = "";
    for (var i = 0; i < chat.users.length; i++) {
      //temp
      chat.users[i].rankId = 0;
      if(chat.users[i].socketId == socket.id){
        currentPseudo = chat.users[i].username;
      }
    }
    //plan de secours =>
    if(currentPseudo == ""){
      for (var i = 0; i < chat.users.length; i++) {
        if(chat.users[i].steamid == data.user.steamid){
          chat.users[i].rankId = 0;
          currentPseudo = chat.users[i].username;
          clientSockets[chat.users[i].socketId] = socket;
        }
      }
    }
    data.date = new Date(data.date);
    var minutes = "" + data.date.getMinutes();
    if(minutes.length == 1)
      minutes = "0"+minutes;

    data.displayDate = data.date.getHours() + ":" +  minutes;

    var currentChannel = chat.channels["général"];
    for (var property in chat.channels) {
      if(chat.channels[property].id == data.channelId){
        currentChannel = chat.channels[property];
      }
    }

    if(currentChannel.messages.length > 0 && data.user.steamid == currentChannel.messages[currentChannel.messages.length-1].user.steamid && Math.round((( (data.date - currentChannel.messages[currentChannel.messages.length-1].date) % 86400000) % 3600000) / 60000) < 2){
      currentChannel.messages[currentChannel.messages.length-1].messages.push(data.messages[0]);
    } else {
      currentChannel.messages.push(data);
    }
    if(currentChannel.messages.length == maxChannelHistory)
      currentChannel.messages.splice(messages.length-1, 1);

    for (var property in chat.channels) {
      if(chat.channels[property].id == currentChannel){
        chat.channels[property] = currentChannel;
      }
    }
    global.redis.set('chat', JSON.stringify(chat));
    this.broadcastMessages();
  }
  broadcastMessages(){
    for (var i = 0; i < chat.users.length; i++) {
      if(clientSockets[chat.users[i].socketId] !== undefined){
        clientSockets[chat.users[i].socketId].emit('updateChat', chat);
      }
    }
  }

  addChatUser(user, socket){
    //console.log(user)
    var foundUser = false;
    for (var i = 0; i < chat.users.length; i++) {
      if(user && chat.users[i].steamid == user.steamid){
        foundUser = true;
        delete clientSockets[chat.users[i].socketId];
        clientSockets[socket.id] = socket;
        chat.users[i].socketId = socket.id;
      }
    }
    if(user && !foundUser){
      clientSockets[socket.id] = socket;
      user.socketId = socket.id;
      user.rankId = 0;
      chat.users.push(user);
    }
    this.broadcastMessages();
  }

  removeChatUser(socket){
    var deleteIndex;
    if(chat !== undefined && chat.users !== undefined && socket !== undefined){
      for (var i = 0; i < chat.users.length; i++) {
        if(chat.users[i].socketId == socket.id){
          deleteIndex = i;
        }
      }
      if(deleteIndex !== undefined){
        chat.users.splice(deleteIndex, 1);
        if(clientSockets[socket.id] !== undefined)
          delete clientSockets[socket.id];
      }
    }
  }

  getChat(){
    return chat;
  }
}
module.exports = new ChatController();
