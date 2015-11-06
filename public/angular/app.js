(function() {
  var lobbyftwApp = angular.module('lobbyftwApp', [
    'ngRoute',
    'ngSocket',
    'lobbyftwControllers'
  ]).config(["$socketProvider", function ($socketProvider) {
      $socketProvider.setUrl("http://localhost:3000");
    }]);

  lobbyftwApp.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
      when('/', {
        templateUrl: '/angular/views/index.html',
        controller: 'indexController'
      }).
      when('/global/', {
        templateUrl: '/angular/views/chat.html',
        controller: 'globalChatController'
      }).
      when('/lobby/:id', {
        templateUrl: '/angular/views/chat.html',
        controller: 'globalChatController'
      })
    }
  ]);

  var lobbyftwControllers = angular.module('lobbyftwControllers', []);

  //main page controller => global
  lobbyftwControllers.controller('mainController', function($scope){

  });

  //index page controller
  lobbyftwControllers.controller('indexController', ['$scope', '$rootScope', '$location', '$http',
    function($scope, $rootScope, $location, $http) {


    }
  ]);

  lobbyftwControllers.controller('globalChatController', ['$scope', '$rootScope', '$socket', '$location', '$http',
    function($scope, $rootScope, $socket, $location, $http) {


      //load user
      $http.get('/loadUser').success(function(data) {
        $rootScope.user = data;

        if(!$rootScope.user){
          $location.path('/');
        }

        $scope.user = $rootScope.user;

        $socket.emit('addChatUser', $scope.user);

        $socket.on('updateChat', function(data) {
            $scope.chat = data;
        });
      });

    }
  ]);

})();
