'use strict'
var clientSockets = {};
var maxChannelHistory = 300;
var chat = {
  channels : {
    "général" : {
      id : 0,
      messages : []
    },
    "room 1" : {
      id : 1,
      messages : []
    },
    "room 2" : {
      id : 2,
      messages : []
    },
    "room 3" : {
      id : 3,
      messages : []
    }
  },
  users : []
};

class ChatController {
  cleanSockets(){
    //todo => suppr disconnected sockets
  }
  updateMessages(socket, data){
    var currentPseudo = "";
    for (var i = 0; i < chat.users.length; i++) {
      if(chat.users[i].socketId == socket.id)
        currentPseudo = chat.users[i].username;
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

    this.broadcastMessages();
  }
  broadcastMessages(){
    for (var i = 0; i < chat.users.length; i++) {
      clientSockets[chat.users[i].socketId].emit('updateChat', chat);
    }
  }

  addChatUser(user, socket){
    console.log(user)
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
      chat.users.push(user);
    }
    this.broadcastMessages();
  }
  getChat(){
    return chat;
  }
}
module.exports = new ChatController();
