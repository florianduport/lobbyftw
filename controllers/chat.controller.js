'use strict'
var sha1 = require('sha1');
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
          rank : {id : 0, name : "Aucun Grade"},
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
          rank : {id : 0, name : "Aucun Grade"},
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
          rank : {id : 0, name : "Aucun Grade"},
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
          rank : {id : 0, name : "Aucun Grade"},
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

var chatTempStorage = {};
class ChatController {
  chatTempStorage(){
    return chatTempStorage;
  }
  cleanSockets(){
    //todo => suppr disconnected sockets
  }
  checkAuthToken(authToken, user){

  }
  updateMessages(socket, data){
    var currentPseudo = "";

    if(data === undefined || data.user === undefined || data.user.steamid === undefined || data.authToken === undefined || !/\S/.test(data.messages[0])){
      return;
    }

    var checkAuthToken = sha1(data.user.steamid+"lobbyftw") == data.authToken;
    if(checkAuthToken){
      delete data.authToken;
      for (var i = 0; i < chat.users.length; i++) {
        //temp
        //chat.users[i].rank = { id: 0 , name: "Aucun grade"};
        if(chat.users[i].socketId == socket.id){
          currentPseudo = chat.users[i].username;
        }
      }
      //plan de secours =>
      if(currentPseudo == ""){
        for (var i = 0; i < chat.users.length; i++) {
          if(chat.users[i].steamid == data.user.steamid){
            if(chat.users[i].rank === undefined)
              chat.users[i].rank = { id: 0 , name: "Aucun grade"};
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

      //check if is open lobby message
      data.isLobbyMessage = false;
      var words = data.messages[0].split(' ');
      for (var i = 0; i < words.length; i++) {
        if(words[i].indexOf('steam://') > -1){
          data.isLobbyMessage = words[i];
          data.isLobbyOpen = true;
        }
      }

      if(!data.isLobbyMessage && currentChannel.messages.length > 0 && data.user.steamid == currentChannel.messages[currentChannel.messages.length-1].user.steamid && !currentChannel.messages[currentChannel.messages.length-1].isLobbyMessage && Math.round((( (data.date - currentChannel.messages[currentChannel.messages.length-1].date) % 86400000) % 3600000) / 60000) < 2){
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
      this.broadcastChat();
    }
  }

  closeLobby(data, socket){
    if(data.authToken !== undefined && data.message !== undefined && data.message.user !== undefined && data.authToken == sha1(data.message.user.steamid+"lobbyftw")){
      if(data.message.channelId !== undefined){

        var currentChannel = chat.channels["général"];
        for (var property in chat.channels) {
          if(chat.channels[property].id == data.channelId){
            currentChannel = chat.channels[property];
          }
        }
        if(currentChannel){
          for (var i = 0; i < currentChannel.messages.length; i++) {
            if(currentChannel.messages[i].isLobbyOpen && currentChannel.messages[i].isLobbyMessage == data.message.isLobbyMessage){
              currentChannel.messages[i].isLobbyOpen = false;
              break;
            }
          }
          for (var property in chat.channels) {
            if(chat.channels[property].id == currentChannel){
              chat.channels[property] = currentChannel;
            }
          }
          global.redis.set('chat', JSON.stringify(chat));
          this.broadcastChat();
        }
      }
    }
  }

  broadcastChat(){
    for (var i = 0; i < chat.users.length; i++) {
      if(clientSockets[chat.users[i].socketId] !== undefined){
        clientSockets[chat.users[i].socketId].emit('updateChat', chat);
      }
    }
  }


  addChatUser(authToken, socket){
    var user;

    var foundUser = false;
    for (var i = 0; i < chat.users.length; i++) {
      if(sha1(chat.users[i].steamid+"lobbyftw") == authToken){
        foundUser = true;
        delete clientSockets[chat.users[i].socketId];
        clientSockets[socket.id] = socket;
        chat.users[i].socketId = socket.id;
        user = chat.users[i];
        if(user.rank === undefined)
          user.rank = { id: 0 , name: "Aucun grade"};
      }
    }
    if(!foundUser){
      for (var element in chatTempStorage) {
        if(element == authToken){
          user = chatTempStorage[element];
          delete chatTempStorage[element];
        }
      }
      if(user) {
        clientSockets[socket.id] = socket;
        user.socketId = socket.id;
        if(user.rank === undefined)
          user.rank = { id: 0 , name: "Aucun grade"};
        chat.users.push(user);
      }

    }
    socket.emit('addChatUserSuccess', user)
    this.broadcastChat();
  }

  updateUser(user, socket){
    for (var i = 0; i < chat.users.length; i++) {
      if(chat.users[i].steamid == user.steamid){
        chat.users[i] = user;
      }
    }
    global.redis.set('chat', JSON.stringify(chat));
    this.broadcastChat();
  }

  getUser(steamid){
    if(chat !== undefined && chat.users !== undefined){
      for (var i = 0; i < chat.users.length; i++) {
        if(chat.users[i].steamid == steamid){
          return chat.users[i];
        }
      }
    }
    //return false;
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
