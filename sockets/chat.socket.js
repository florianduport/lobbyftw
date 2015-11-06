'use strict'
var chatController = require('../controllers/chat.controller');
class ChatSocket {
  constructor(){
    global.io.on('connection', function(socket){

      socket.on('addChatUser', function(pseudo){
        console.log('ok');
        chatController.addChatUser(pseudo, socket);
      })

      //console.log(socket);

      //socket.emit('updateMessages', { hello: 'worlddd' });

      socket.on('sendMessage', function (data) {
        chatController.updateMessages(socket, data);
      });

    });
  }
}

module.export = new ChatSocket();
