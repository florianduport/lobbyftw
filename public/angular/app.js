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

      $scope.channel = 0;
      if ($routeParams !== undefined && $routeParams.id !== undefined) {
        $scope.channel = $routeParams.id;
      }

      $scope.sendMessage = function(channelId, message) {
        $socket.emit('sendMessage', {
          channelId: channelId,
          user: $scope.user,
          messages: [message],
          date: new Date()
        });
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

        $scope.user = $rootScope.user;

        $socket.emit('addChatUser', $scope.user);

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
