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
       y<this.dimension && this.boardMatrix[x][y]!=='*') {
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
  for(i=0; i<this.numOfMine;i++){
    var x = parseInt((Math.random()*10)%this.dimension);
    var y = parseInt((Math.random()*10)%this.dimension);
    if(this.boardMatrix[x][y] === '*'){
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

function GameController($scope)
{
  var numOfMine = 8;
  $scope.dimension = 8;
  $scope.maximumUncoverLimit = ($scope.dimension*$scope.dimension)-numOfMine;

  //game finished. check for success/fail
  $scope.gameOver = function(x, y) {
    if($scope.board[x][y] === '*'){
      angular.element('.box-'+x+'-'+y).removeClass('covered').addClass('crash');
      $scope.status = 'fail';
    }
    else{
      $scope.status = 'success';
    }
    angular.element('.mine').removeClass('covered').addClass('uncovered');
  };

  //show the value of the box to user
  $scope.unCover = function(x, y){

    if(x >= 0 && x < $scope.dimension && y >= 0 && y < $scope.dimension &&
      angular.element('.box-' + x + '-' + y).hasClass('covered')) {

      angular.element('.box-' + x + '-' + y).removeClass('covered').addClass('uncovered');

      if ($scope.board[x][y] === 0) {
        $scope.unCover(x - 1, y - 1);
        $scope.unCover(x - 1, y);
        $scope.unCover(x - 1, y + 1);
        $scope.unCover(x, y - 1);
        $scope.unCover(x, y + 1);
        $scope.unCover(x + 1, y - 1);
        $scope.unCover(x + 1, y);
        $scope.unCover(x + 1, y + 1);
      }
      var currentlyUncovered  = angular.element('.mine.uncovered').length;
      if(currentlyUncovered >= $scope.maximumUncoverLimit){
        $scope.gameOver(x,y);
      }
    }
  };

  //event handler upon clicking a specific box
  $scope.boxClicked = function(x, y){

    if($scope.board[x][y] === '*'){
      //TODO verify success status
      $scope.gameOver(x, y);
    }
    else {
      $scope.unCover(x, y);
    }
  };

  //set flagged status for suspicious box
  $scope.setFlagged = function(x,y){
    angular.element('.box-'+x+'-'+y+' div.flag').addClass('glyphicon-flag');
  };

  //initialize game
  $scope.resetGame = function() {
    $scope.status = '';
    angular.element('.mine').removeClass('uncovered crash').addClass('covered');
    angular.element('.mine div.flag').removeClass('glyphicon-flag');
    $scope.board = [];
    $scope.board = new Board($scope.dimension, numOfMine).boardMatrix;
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

//The main game controller definition and activity
app.controller('GameCtrl', GameController);
