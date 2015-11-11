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
      $scope.authToken = jQuery("#authToken").val();
      $scope.ranks = [{
        id: 0,
        name: "Aucun grade"
      }, {
        id: 1,
        name: "Silver I"
      }, {
        id: 2,
        name: "Silver II"
      }, {
        id: 3,
        name: "Silver III"
      }, {
        id: 4,
        name: "Silver IV"
      }, {
        id: 5,
        name: "Silver Elite"
      }, {
        id: 6,
        name: "Silver Elite Master"
      }, {
        id: 7,
        name: "Gold Nova I"
      }, {
        id: 8,
        name: "Gold Nova II"
      }, {
        id: 9,
        name: "Gold Nova III"
      }, {
        id: 10,
        name: "Gold Nova Master"
      }, {
        id: 11,
        name: "Master Guardian I"
      }, {
        id: 12,
        name: "Master Guardian II"
      }, {
        id: 13,
        name: "Master Guardian Elite"
      }, {
        id: 14,
        name: "Distinguished Master Guardian"
      }, {
        id: 15,
        name: "Legendary Eagle"
      }, {
        id: 16,
        name: "Legendary Eagle Master"
      }, {
        id: 17,
        name: "Supreme Master First Class"
      }, {
        id: 18,
        name: "The Global Elite"
      }, ]

      $scope.channel = 0;
      if ($routeParams !== undefined && $routeParams.id !== undefined) {
        $scope.channel = $routeParams.id;
      }
      $scope.updateUser = function() {
        //fix rank
        for (var i = 0; i < $scope.ranks.length; i++) {
          if($scope.ranks[i].id == $scope.user.rank.id)
            $scope.user.rank = $scope.ranks[i];
        }
        localStorage.setItem('rank', $scope.user.rank.id);
        $socket.emit('updateUser', $scope.user);
      }

      $socket.on('disconnect', function() {
        var socketState = false;
        $socket.on('connect', function() {
          $socket.emit('addChatUser', $scope.user);
          socketState = true;
        });
        var tryReconnect = function() {
          setTimeout(function() {
            if (!socketState) {
              $socket.getSocket().connect();
              setTimeout(function() {
                tryReconnect();
              }, 1000);
            } else {
              return;
            }
          }, 2000);
        }
        tryReconnect();

      })

      $scope.sendMessage = function(channelId, message) {
        if (message.replace(' ', '') !== "") {
          $socket.emit('sendMessage', {
            authToken: $scope.authToken,
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

      $scope.closeLobby = function(message){
        $socket.emit('closeLobby', {authToken : $scope.authToken, message : message});
      }

      $socket.emit('addChatUser', $scope.authToken);

      $socket.on('addChatUserSuccess', function(data) {

        $rootScope.user = data;
        if (!$rootScope.user) {
          $location.path('/');
        } else {

          var rankStorage = localStorage.getItem('rank');
          if(rankStorage !== null) {
            $rootScope.user.rank = $scope.ranks[rankStorage];
            $scope.rank = $rootScope.user.rank;
            $scope.user = $rootScope.user;
            $scope.updateUser();
          }

          $scope.user = $rootScope.user;


          $socket.on('updateChat', function(data) {
            //console.log(data);
            $scope.chat = data;
            $scope.currentChannel;
            for (var channelEl in $scope.chat.channels) {
              if ($scope.chat.channels[channelEl].id == $scope.channel) {
                $scope.currentChannel = $scope.chat.channels[channelEl];
              }
            }
            for (var i = 0; i < $scope.chat.users.length; i++) {
              if ($scope.chat.users[i].steamid == $scope.user.steamid) {
                $scope.user = $scope.chat.users[i];
                $scope.rank = $scope.user.rank;
              }
            }
            checkLinks();
            var height = jQuery("#chatzone_content")[0].scrollHeight;
            jQuery("#chatzone_content").scrollTop(height + 150);
          });
        }
      });

    }
  ]);

})();
