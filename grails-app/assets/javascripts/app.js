(function() {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('app', [
        'app.directive',
        'app.config',
        'app.user',
        'app.home',
        'ui.router',
        'pascalprecht.translate'
    ]).config(['$stateProvider', '$urlRouterProvider', '$translateProvider', 'LocalConfig', function ($stateProvider, $urlRouterProvider, $translateProvider, LocalConfig) {
        var pathConfig = LocalConfig.path;
        $urlRouterProvider.otherwise('/login');

        _.each(pathConfig, function(path){
            $stateProvider.state(path);
        });

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/locale-',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('zh');

    }]).controller('defaultCtrl', [ function(){
    }]).run(run);

    run.$inject = ['$rootScope', '$state', '$cookies', '$http', 'LocalConfig'];
    function run($rootScope, $state, $cookies, $http, LocalConfig) {
        // keep user logged in after page refresh
        var globals = $cookies.get('globals');
        if(globals){
            $rootScope.globals = JSON.parse(globals)
        }else{
            $rootScope.globals = {};
        }
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var noRestrictedState = _.any(LocalConfig.noControlStates, function(state){
               return $state.is(state);
            });
            //console.log('restrictedPage: ' + restrictedPage);
            var loggedIn = $rootScope.globals.currentUser;
            if (!noRestrictedState && !loggedIn) {
                $state.transitionTo('login');
            }
        });

    }
})();
