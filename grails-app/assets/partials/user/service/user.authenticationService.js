(function(){
    'use strict';

    angular.
        module('app.user').
        factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', 'UserService', '$timeout'];
    function AuthenticationService($http, $cookies, $rootScope, UserService, $timeout){
        var service = {};
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function Login(email, password, callback) {
            //if (!LocalConfig.debugMode) {
            //    $http.post(LocalConfig.backend + '/api/authenticate', {username: email, password: password})
            //        .success(function (response) {
            //            callback(response);
            //        });
            //} else {
                dummyLogin(email, password, callback);
            //}
        }

        function dummyLogin(email, password, callback){
            $timeout(function () {
                var response;
                UserService.GetByParam(email, 'email')
                    .then(function (user) {
                        if (user !== null && user.password === password) {
                            response = {success: true};
                        } else {
                            response = {success: false, message: 'Username or password is incorrect'};
                        }
                        callback(response);
                    });
            }, 1000);
        }

        function SetCredentials(username, password) {
            var authdata =  username + ':' + password;
            $rootScope.globals = {};
            $rootScope.globals.currentUser = {
                    username: username,
                    authdata: authdata
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookies.putObject('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        }

    }
})();
