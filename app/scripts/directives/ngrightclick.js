'use strict';

/**
 * @ngdoc directive
 * @name minesweeperApp.directive:ngRightClick
 * @description
 * # ngRightClick
 * directive for mouse right click event
 */
angular.module('minesweeperApp')
  .directive('ngRightClick', function ($parse) {
    return function(scope, element, attrs) {
      var fn = $parse(attrs.ngRightClick);
      element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          event.preventDefault();
          fn(scope, {$event:event});
        });
      });
    };
  });
