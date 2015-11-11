'use strict'
var chatController = require('../controllers/chat.controller');
class ChatSocket {
  constructor(){
    global.io.on('connection', function(socket){
      socket.on('addChatUser', function(user){
        chatController.addChatUser(user, socket);
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
