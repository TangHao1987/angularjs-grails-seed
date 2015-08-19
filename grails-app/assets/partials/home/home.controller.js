(function(){
    'use strict';
    var homeModel = angular.module('app.home', ['app.config', 'app.user', 'ui.router']);
    homeModel.controller('HomeCtrl', ['$scope', function($scope){

    }]);

    homeModel.controller('NavbarCtrl', ['$scope', '$http', '$state', 'LocalConfig', 'AuthenticationService',function($scope, $http, $state, LocalConfig, AuthenticationService){
        $http.get(LocalConfig.json.menu).then(function(resp){
            $scope.menuItems = resp.data;
        });
        $scope.currentPageName = '';
        $scope.clickMenuItem = function(menuItem){
            if(menuItem.url){
                $state.transitionTo(menuItem.url);
            }else{
                menuItem.showSub = !menuItem.showSub;
                if($scope.lastItem && $scope.lastItem !== menuItem){
                    $scope.lastItem.showSub = false;
                    if($scope.lastSubItem){
                        $scope.lastSubItem.showSub = false;
                        $scope.lastSubItem = null;
                    }
                }
                $scope.lastItem = menuItem;
            }
        };

        $scope.clickSubItem = function(subItem){
            if(subItem.url){
                $state.transitionTo(subItem.url);
            }else{
                subItem.showSub = !subItem.showSub;
                if($scope.lastSubItem && $scope.lastSubItem !== subItem){
                    $scope.lastSubItem.showSub = false;
                }
                $scope.lastSubItem = subItem;
            }
        };

        $scope.logout = function(){
            AuthenticationService.ClearCredentials();
            $state.transitionTo('login');
        };
    }]);

    homeModel.filter('menuFilter', function($filter){
        var standardFilter = $filter('filter');
        return function(menuItems , searchText){

            function hasTransValue(item){
                if(searchText == undefined || searchText == '') return true;
                var name = item.name;
                var translatedVal = $filter('translate')(name);
                return translatedVal?translatedVal.match(new RegExp(searchText,"i")) : false;
            }

            var filterFunc = function(val, ind, arr){
                var hasVal = hasTransValue(val);
                if(val.subItems){
                    hasVal = hasVal || _.any(val.subItems, function(item){
                        var hasSubVal = hasTransValue(item);
                        if(item.subItems){
                            hasSubVal = hasSubVal || _.any(item.subItems, function(subItem){
                                return hasTransValue(subItem);
                            });
                        }
                        return hasSubVal;
                    });

                }
                return hasVal;
            };

            var out = standardFilter(menuItems, filterFunc);
            if(searchText && searchText.length > 0) {
                _.each(out, function (menuItem) {
                    if (menuItem.subItems != undefined) {
                        var subItem = _.find(menuItem.subItems, function (subItem) {
                            return hasTransValue(subItem)
                        });

                        var findSub = false;
                        _.each(menuItem.subItems, function (subItem) {
                            if(subItem.subItems){
                                var subSubItem = _.find(subItem.subItems, function (subSubItem) {
                                    return hasTransValue(subSubItem)
                                });
                                if(subSubItem !== undefined){
                                    subItem.showSub = true;
                                    findSub = true;
                                }else{
                                    subItem.showSub = false;
                                }
                            }
                        });
                        menuItem.showSub = !!(subItem !== undefined || findSub);
                    }

                });
            }
            return out;
        7}
    })
})();
