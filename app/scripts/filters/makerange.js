'use strict';

/**
 * @ngdoc filter
 * @name minesweeperApp.filter:makeRange
 * @function
 * @description
 * # makeRange
 * filter to loop over specified range
 */
angular.module('minesweeperApp')
  .filter('makeRange', function () {
    return function(inp) {
      var range = [+inp[1] && +inp[0] || 0, +inp[1] || +inp[0]];
      var min = Math.min(range[0], range[1]);
      var max = Math.max(range[0], range[1]);
      var result = [];
      for (var i = min; i <= max; i++){
        result.push(i);
      }
      if (range[0] > range[1]){
        result.reverse();
      }
      return result;
    };
  });
