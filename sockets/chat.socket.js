'use strict'
var chatController = require('../controllers/chat.controller');
class ChatSocket {
  constructor(){
    global.io.on('connection', function(socket){

      socket.on('addChatUser', function(user){
        chatController.addChatUser(user, socket);
      })

      //console.log(socket);

      //socket.emit('updateMessages', { hello: 'worlddd' });

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
