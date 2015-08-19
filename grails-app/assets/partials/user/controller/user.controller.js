(function () {
    'use strict';
    var user = angular.module('app.user');

    user.controller("LoginCtrl", ['$scope', '$state', 'AuthenticationService', function ($scope, $state, AuthenticationService) {
        $scope.hasError = false;
        $scope.login = function () {
            AuthenticationService.Login($scope.email, $scope.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.email, $scope.password);
                    $state.transitionTo('home');
                    $scope.hasError = false;
                } else {
                    $scope.hasError = true;
                }
            })
        }

    }]);


    user.controller("RegistrationCtrl", ["$scope", "$state", function ($scope, $state) {
    }]);


    user.controller("UserManagementCtrl", ["$scope", "UserService", "$state", function ($scope, UserService, $state) {
        UserService.GetAll().then(function (users) {
            $scope.users = users;
        });
    }]);

    user.run(function ($templateCache, $http) {
        $http.get('messages.html')
            .then(function (response) {
                $templateCache.put('error-messages', response.data);
            })
    })
})();