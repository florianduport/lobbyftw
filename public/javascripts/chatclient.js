$(document).ready(function(){

  var chat = {};

  var socket = io.connect('http://localhost:3000');

  socket.emit('addChatUser', $("#chatPseudo").val());

  socket.on('updateChat', function(data){
    chat = data;
    updateDomElements();
  });

  $("#sendMessage").click(function(){
    console.log($("#messageToSend").val());
    socket.emit('sendMessage', { message : $("#messageToSend").val() });
  });

  var updateDomElements = function(){
    var userList = [];
    for (var i = 0; i < chat.users.length; i++) {
      userList.push("<li>"+chat.users[i].username+"</li>");
    }

    $("#connectedUsers").html(userList.join(''));


    var messageList = [];
    for (var i = 0; i < chat.messages.length; i++) {
      messageList.push("<li>"+chat.messages[i].pseudo+" : "+chat.messages[i].message+"</li>");
    }

    $("#messageList").html(messageList.join(''))
  }
});
