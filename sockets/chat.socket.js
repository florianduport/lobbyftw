'use strict'
var chatController = require('../controllers/chat.controller');
class ChatSocket {
  constructor(){
    global.io.on('connection', function(socket){

      socket.on('addChatUser', function(authToken){
        chatController.addChatUser(authToken, socket);
      })

      socket.on('closeLobby', function(data){
        chatController.closeLobby(data, socket);
      })

      socket.on('updateUser', function(user){
        chatController.updateUser(user, socket);
      })

      socket.on('sendMessage', function (data) {
        chatController.updateMessages(socket, data);
      });

      socket.on('disconnect', function() {
        chatController.removeChatUser(socket);
      });

    });
  }
}

module.export = new ChatSocket();
