'use strict';

/**
 * Definition of the board class
 * @param dimension
 * @param numOfMine
 * @constructor
 */
function Board(dimension, numOfMine)
{
  this.boardMatrix = [];
  this.dimension = dimension;
  this.numOfMine = numOfMine;

  //update a specified box counter
  this.updateCounter = function(x, y) {
    if(x >=0 && x< this.dimension && y>=0 &&
       y<this.dimension && this.boardMatrix[x][y]!='*') {
      this.boardMatrix[x][y]++;
    }
  };

  //Initialize boxes with 0
  for(var i=0; i<this.dimension; i++) {
    var row = [];
    for(var j=0; j<this.dimension; j++) {
      row.push(0);
    }
    this.boardMatrix.push(row);
  }

  //set specified number of mines
  for(var i=0; i<this.numOfMine;i++){
    var x = parseInt((Math.random()*10)%8);
    var y = parseInt((Math.random()*10)%8);
    if(this.boardMatrix[x][y] == '*'){
      //if its already been set as mine, try for a new one
      i--;
      continue;
    }

    this.boardMatrix[x][y] = '*';

    //update all 8 attached box counters
    this.updateCounter(x-1,y-1);
    this.updateCounter(x-1,y);
    this.updateCounter(x-1,y+1);
    this.updateCounter(x,y-1);
    this.updateCounter(x,y+1);
    this.updateCounter(x+1,y-1);
    this.updateCounter(x+1,y);
    this.updateCounter(x+1,y+1);
  }
}


/**
 * @ngdoc function
 * @name minesweeperApp.controller:GameCtrl
 * @description
 * # GameCtrl
 * Controller of the minesweeperApp
 */
var app = angular.module('minesweeperApp');

//directive to loop over specified range
app.filter('makeRange', function() {
    return function(inp) {
      var range = [+inp[1] && +inp[0] || 0, +inp[1] || +inp[0]];
      var min = Math.min(range[0], range[1]);
      var max = Math.max(range[0], range[1]);
      var result = [];
      for (var i = min; i <= max; i++) result.push(i);
      if (range[0] > range[1]) result.reverse();
      return result;
    };
  });

//directive for mouse right click event
app.directive('ngRightClick', function($parse) {
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

//The main game controller definition and activity
app.controller('GameCtrl', function ($scope) {
    var numOfMine = 3;
    $scope.status = "";
    //TODO check variation
    $scope.dimension = 7;
    $scope.board = new Board($scope.dimension, numOfMine).boardMatrix;

    //game finished. check for success/fail
    $scope.gameOver = function(x, y) {
      angular.element(".box-"+x+"-"+y).removeClass("covered").addClass("crash");
      if($scope.board[x][y] == '*'){
        $scope.status = "fail";
        angular.element(".mine").removeClass("covered").addClass("uncovered");
      }
      else{
        $scope.status = "success";
      }
    };

    //event handler upon clicking a specific box
    $scope.boxClicked = function(x, y){
      if($scope.board[x][y] == '*' || angular.element(".mine.covered").length <=0 ||
        angular.element(".mine.uncovered, .mine .glyphicon-flag").length >=($scope.dimension*$scope.dimension)-1){
        //TODO verify success status
        $scope.gameOver(x,y);
      }
      else {
        angular.element(".box-" + x + "-" + y).removeClass("covered").addClass("uncovered");
      }
    };

    //set flagged status for suspicious box
    $scope.setFlagged = function(x,y){
      angular.element(".box-"+x+"-"+y+" div.flag").addClass("glyphicon-flag");
    };

    $scope.resetGame = function() {
      $scope.status = "";
      angular.element(".mine").removeClass("uncovered crash").addClass("covered");
      $scope.board = [];
      $scope.board = new Board($scope.dimension, numOfMine).boardMatrix;

    }
});
