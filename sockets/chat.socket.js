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

      socket.on('sendMessage', function (channel, data) {
        chatController.updateMessages(socket, channel, data);
      });

    });
  }
}

module.export = new ChatSocket();
