/**
 * Created by tang.hao on 25/6/2015.
 */
(function () {
    'use strict';

    angular
        .module('app.user')
    .factory('UserService', UserService);

    UserService.$inject = ['$q', '$resource', 'LocalConfig'];
    function UserService($q, $resource, LocalConfig) {

        var service = {};

        service.GetAll = GetAll;
        service.GetByParam = GetByParam;
        service.CreateOrUpdate = CreateOrUpdate;
        service.Delete = Delete;

        return service;

        function execute(callBack){
            var deferred = $q.defer();
            var users = getUsers();
            callBack(deferred, users);
            return deferred.promise;
        }

        function GetAll() {
            return execute(function (deferred, users) {
                users.query(function(response){
                    deferred.resolve(response);
                });
            });
        }

        function GetByParam(param, name) {
            return execute(function (deferred, users) {
                users.query(function(response){
                    var user = findUserByParam(response, param, name);
                    if(user){
                        deferred.resolve(user);
                    }else{
                        deferred.reject('user not found');
                    }
                });
            });
        }

        function findUserByParam(response, param, term){
            if(term === 'id'){
                return _.find(response, function(item){
                    return item.id === param;
                });
            }else if(term === 'email'){
                return _.find(response, function(item){
                    return item.email === param;
                });
            }
        }

        function CreateOrUpdate(user) {
            return execute(function (deferred, users) {
                    users.query(function(response){
                        var findUser = findUserByParam(response, user.email, 'email');
                        if(findUser){
                            findUser.password = user.password;
                            findUser.$save();
                            deferred.resolve(findUser);
                        }else{
                            var lastUser = _.last(response);
                            var newUser = new users();
                            newUser.id = lastUser.id + 1;
                            newUser.email = user.email;
                            newUser.password = user.password;
                            newUser.$save();
                            deferred.resolve(newUser);
                        }
                    });
            });
        }

        function Delete(id) {
            return execute(function (deferred, users) {
                users.query(function (response) {
                    var user = findUserByParam(response, id, 'id');
                    if (user == null) {
                        deferred.reject('user not found')
                    } else {
                        user.$delete();
                        deferred.resolve('success');
                    }
                });
            });
        }

        function getUsers(){
            return $resource(LocalConfig.json.user, {id: '@id'}, {
                query: {method:'GET', isArray:true
                }});
        }
    }
})();