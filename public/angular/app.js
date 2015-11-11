(function() {
  var lobbyftwApp = angular.module('lobbyftwApp', [
    'ngRoute',
    'ngSocket',
    'lobbyftwControllers'
  ]).config(["$socketProvider", function($socketProvider) {
    var socketServer = location.hostname;
    if (socketServer.indexOf("localhost") > -1) {
      socketServer += ":3000";
    }
    $socketProvider.setUrl(socketServer);
  }]);

  lobbyftwApp.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
      when('/', {
        templateUrl: '/angular/views/index.html',
        controller: 'indexController'
      }).
      when('/general/', {
        templateUrl: '/angular/views/chat.html',
        controller: 'globalChatController'
      }).
      when('/room/:id', {
        templateUrl: '/angular/views/chat.html',
        controller: 'globalChatController'
      })
    }
  ]);

  var lobbyftwControllers = angular.module('lobbyftwControllers', []);

  //main page controller => global
  lobbyftwControllers.controller('mainController', function($scope) {

  });

  //index page controller
  lobbyftwControllers.controller('indexController', ['$scope', '$rootScope', '$location', '$http',
    function($scope, $rootScope, $location, $http) {


    }
  ]);

  lobbyftwControllers.controller('globalChatController', ['$scope', '$rootScope', '$routeParams', '$socket', '$location', '$http',
    function($scope, $rootScope, $routeParams, $socket, $location, $http) {

      $scope.ranks = [
        "Aucun grade",
        "Silver I",
        "Silver II",
        "Silver III",
        "Silver IV",
        "Silver Elite",
        "Silver Elite Master",
        "Gold Nova I",
        "Gold Nova II",
        "Gold Nova III",
        "Gold Nova Master",
        "Master Guardian I",
        "Master Guardian II",
        "Master Guardian Elite",
        "Distinguished Master Guardian",
        "Legendary Eagle",
        "Legendary Eagle Master",
        "Supreme Master First Class",
        "The Global Elite",
      ]

      $scope.channel = 0;
      if ($routeParams !== undefined && $routeParams.id !== undefined) {
        $scope.channel = $routeParams.id;
      }

      $socket.on('disconnect', function(){
        var socketState = false;
        $socket.on('connect', function(){
          $socket.emit('addChatUser', $scope.user);
          socketState = true;
        });
        var tryReconnect = function(){
          setTimeout(function(){
              if(!socketState){
                $socket.getSocket().connect();
                setTimeout(function(){
                  tryReconnect();
                }, 1000);
              }
              else{
                return;
              }
          }, 2000);
        }
        tryReconnect();

      })

      $scope.sendMessage = function(channelId, message) {
        if(message.replace(' ', '') !== ""){
          $socket.emit('sendMessage', {
            channelId: channelId,
            user: $scope.user,
            messages: [message],
            date: new Date()
          });
        }
      }
      $scope.isCurrentChannel = function(channel) {

        if ($scope.channel == channel.id)
          return "active";
        else
          return false;
      }

      //load user
      $http.get('/loadUser').success(function(data) {
        $rootScope.user = data;

        if (!$rootScope.user) {
          $location.path('/');
        }
        $rootScope.user.rankId = 0;
        $scope.user = $rootScope.user;

        $socket.emit('addChatUser', $scope.user);

        $socket.on('updateUsers', function(data){
          if(data !== undefined && data.users !== undefined $scope.chat !== undefined && $scope.chat.users !== undefined){
              for (var j = 0; j < data.users.length; j++) {
                for (var i = 0; i < $scope.chat.users.length; i++) {
                  if($scope.chat.users[i].steamid == data.users[j].steamid){
                      $scope.chat.users[i] = data.users[j];
                      if($scope.chat.users[i].steamid == $scope.user.steamid){
                        $rootScope.user = data.users[j];
                        $scope.user = $rootScope.user;
                      }
                  }
                }
              }
          }
          if(data){
          }
        });
        $socket.on('updateChat', function(data) {
          console.log(data);
          $scope.chat = data;
          $scope.currentChannel;
          for (var channelEl in $scope.chat.channels) {
            if ($scope.chat.channels[channelEl].id == $scope.channel) {
              $scope.currentChannel = $scope.chat.channels[channelEl];
            }
          }
          var height = jQuery("#chatzone_content")[0].scrollHeight;
          jQuery("#chatzone_content").scrollTop(height + 150);
        });
      });

    }
  ]);

})();
