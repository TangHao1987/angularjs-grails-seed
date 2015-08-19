/**
 * Created by Hao on 17/7/2015.
 */
/**
 * Created by tang.hao on 25/6/2015.
 */
(function () {
    'use strict';

    angular
        .module('app.directive')
        .factory('DirectiveService', DirectiveService);

    function DirectiveService() {
        var colors = ['#d9534f', '#D98F55', '#D5D94A', '#9CD94A', '#5FD94B'];


        return {
            getColor: getColor
        };

        function measureStrength(password) {
            var force = 0;
            var regex = /[$-/:-?{-~!"^`\[\]]/g;
            var lowerLetters = /[a-z]+/.test(password);
            var upperLetters = /[A-Z]+/.test(password);
            var numbers = /[0-9]+/.test(password);
            var symbols = regex.test(password);

            var flags = [lowerLetters, upperLetters, numbers, symbols];
            var passedMatches = $.grep(flags, function (el) {
                return el === true;
            }).length;

            force += 2 * password.length + ((password.length >= 10) ? 1 : 0);
            force += passedMatches * 10;
            force = (password.length <= 6) ? Math.min(force, 10) : force;
            force = (passedMatches == 1) ? Math.min(force, 10) : force;
            force = (passedMatches == 2) ? Math.min(force, 20) : force;
            force = (passedMatches == 3) ? Math.min(force, 40) : force;

            return force;

        }

        function getColor(password) {
            var force = measureStrength(password);
            var idx = Math.min(5, Math.floor( (force-1)/10) + 1);
            return {idx: idx, col: colors[idx-1]};
        }
    }
})();