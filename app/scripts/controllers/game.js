'use strict';

/**
 * Definition of the Board class
 * @param dimension
 * @param numOfMine
 * @constructor
 */
function Board(dimension, numOfMine, edgeTraveler)
{
  this.boardMatrix = [];
  this.dimension = dimension;
  this.numOfMine = numOfMine;

  var me = this;
  //update a specified box counter
  this.updateCounter = function(x, y) {
    if(x >=0 && x< me.dimension && y>=0 &&
       y<me.dimension && me.boardMatrix[x][y]!=='*') {
      me.boardMatrix[x][y]++;
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
  for(i=0; i<this.numOfMine;i++) {
    var x = parseInt((Math.random()*10)%this.dimension);
    var y = parseInt((Math.random()*10)%this.dimension);
    if(this.boardMatrix[x][y] === '*'){
      //if its already been set as mine, try for a new one
      i--;
      continue;
    }

    this.boardMatrix[x][y] = '*';

    //update all 8 attached box counters
    edgeTraveler(x, y, this.updateCounter);
  }
}

/**
 * Definition for main Game Controller class
 * @param $scope
 * @param $rootScope
 * @param edgeTraveler
 * @constructor
 */
function GameController($scope, $rootScope, edgeTraveler)
{
  var numOfMine = 8;
  $scope.dimension = 8;
  $scope.maximumUncoverLimit = ($scope.dimension*$scope.dimension)-numOfMine;

  $scope.getBoxClass = function(x, y) {
    return '.box-' + x + '-' + y;
  };

  //game finished. check for success/fail
  $scope.gameOver = function(x, y) {
    if($scope.board[x][y] === '*') {
      angular.element($scope.getBoxClass(x, y)).removeClass('covered').addClass('crash');
      $scope.status = 'fail';
    }
    else{
      $scope.status = 'success';
    }
    angular.element('.mine').removeClass('covered').addClass('uncovered');
    angular.element('.mine span').removeClass('hidden')
  };

  //show the value of the box to user
  $scope.unCover = function(x, y) {

    if(x >= 0 && x < $scope.dimension && y >= 0 && y < $scope.dimension &&
      angular.element($scope.getBoxClass(x, y)).hasClass('covered')) {

      angular.element($scope.getBoxClass(x, y)).removeClass('covered').addClass('uncovered');
      angular.element($scope.getBoxClass(x, y)+' span').removeClass('hidden');

      if ($scope.board[x][y] === 0) {
        //unconver attached risk free boxes
        edgeTraveler(x, y, $scope.unCover);
      }

      var currentlyUncovered  = angular.element('.mine.uncovered').length;
      if(currentlyUncovered >= $scope.maximumUncoverLimit){
        $scope.gameOver(x,y);
      }
    }
  };

  //event handler upon clicking a specific box
  $scope.boxClicked = function(x, y) {

    if($scope.board[x][y] === '*'){
      //TODO verify success status
      $scope.gameOver(x, y);
    }
    else {
      $scope.unCover(x, y);
    }
  };

  //set flagged status for suspicious box
  $scope.setFlagged = function(x,y) {
    angular.element($scope.getBoxClass(x, y)+' div.flag').addClass('glyphicon-flag');
  };

  //initialize game
  $scope.resetGame = function() {
    $scope.status = '';
    angular.element('.mine').removeClass('uncovered crash').addClass('covered');
    angular.element('.mine div.flag').removeClass('glyphicon-flag');
    angular.element('.mine span').addClass('hidden');
    $scope.board = [];
    $scope.board = new Board($scope.dimension, numOfMine, edgeTraveler).boardMatrix;
  };

  $scope.resetGame();
}


/**
 * @ngdoc function
 * @name minesweeperApp.controller:GameCtrl
 * @description
 * # GameCtrl
 * Controller of the minesweeperApp
 */
var app = angular.module('minesweeperApp');

app.config(function($provide) {
  $provide.factory('edgeTraveler', function(){
    return function(x, y, callback){
      //call to callback for all attached edges of the box
      //validation of the x/y value must need to be done inside callback
      callback(x - 1, y - 1);
      callback(x - 1, y);
      callback(x - 1, y + 1);
      callback(x, y - 1);
      callback(x, y + 1);
      callback(x + 1, y - 1);
      callback(x + 1, y);
      callback(x + 1, y + 1);
    };
  });
});

//The main game controller definition and activity
app.controller('GameCtrl', GameController);
