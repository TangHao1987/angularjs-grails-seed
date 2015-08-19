(function () {
    'use strict';
    var dirModule = angular.module('app.directive', []);
    dirModule.directive('refClick', function ($state) {
        return function (scope, element, attrs) {
            var path;

            attrs.$observe('refClick', function (val) {
                path = val;
            });

            element.bind('click', function () {
                scope.$apply(function () {
                    $state.transitionTo(path);
                });
            });
        };
    });

    dirModule.directive('compareTo', function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    });

    dirModule.directive('checkStrength', function (DirectiveService) {
        return {
            replace: false,
            restrict: 'EACM',
            require: 'ngModel',
            link: function (scope, iElement, iAttrs, password) {
                scope.$watch(iAttrs.for, function () {
                    var passwordValue = password.$viewValue;
                    var ul = iElement.children();
                    if (!passwordValue || passwordValue === '') {
                        ul.css({"display": "none"});
                    } else {
                        var c = DirectiveService.getColor(passwordValue);
                        ul.css({"display": "inline"});
                        ul.children('li')
                            .css({"background": "#DDD"})
                            .slice(0, c.idx)
                            .css({"background": c.col});
                    }
                });

            },
            templateUrl: 'partials/directives/directive.checkStrength.html'
        };

    });

    dirModule.directive('slideToggle', function () {
        return {
            restrict: 'A',
            scope: {
                isOpen: "=slideToggle"
            },
            link: function (scope, element, attr) {
                var slideDuration = parseInt(attr.slideToggleDuration, 10) || 200;
                if (attr.startShown == "false") {
                    element.hide();
                }
                scope.$watch('isOpen', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        element.stop().slideToggle(slideDuration);
                    }
                });
            }
        };
    });

    dirModule.directive('localeSelector', function($translate) {
        return {
            restrict: 'C',
            replace: true,
            templateUrl: 'partials/directives/directive.localeSelector.html',
            link: function(scope, elem, attrs) {
                // Get active locale even if not loaded yet:
                scope.locale = $translate.proposedLanguage();

                scope.setLocale = function() {
                    $translate.use(scope.locale);
                };
            }
        };
    });
})();
