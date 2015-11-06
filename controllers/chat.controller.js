'use strict'
var clientSockets = {};
var chat = {
  messages : [],
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
    data.displayDate = data.date.getHours() + ":" + data.date.getMinutes();
    console.log(data);
    if(chat.messages.length > 0 && data.user.steamid == chat.messages[chat.messages.length-1].user.steamid && Math.round((( (data.date - chat.messages[chat.messages.length-1].date) % 86400000) % 3600000) / 60000) < 2){
      chat.messages[chat.messages.length-1].messages.push(data.messages[0]);
    } else {
      chat.messages.push(data);
    }
    if(chat.messages.length == 50)
      chat.messages.splice(messages.length-1, 1);

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
