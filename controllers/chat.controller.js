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

    chat.messages.push({
      pseudo : currentPseudo,
      message: data.message,
      date : new Date()
    });
    if(chat.messages.length == 50)
      chat.messages.splice(messages.length-1, 1);

    this.broadcastMessages();
  }
  broadcastMessages(){
    for (var i = 0; i < chat.users.length; i++) {
      clientSockets[chat.users[i].socketId].emit('updateChat', chat);
    }
  }

  addChatUser(username, socket){
    if(chat.users.indexOf(username) == -1){
      clientSockets[socket.id] = socket;
      chat.users.push({ username : username, socketId : socket.id });
    }
    this.broadcastMessages();
  }
  getChat(){
    return chat;
  }
}
module.exports = new ChatController();
