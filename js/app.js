"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

//TODO need to comment pretty much everything still
var commentUrl = 'https://api.parse.com/1/classes/comments';

angular.module('ReviewApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = '60ypM7lcWmFhGNcCsZiAIGOXylNCdTfShcLSJyu2';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'N5CZwpHxTSyTWxCsJOrAXsQLG5QRKA8RTpwSXCjd';
    })
    .controller('ReviewsController', function($scope, $http) {
        $scope.comments = [];
        $scope.errorMessage = null;

        $scope.getComments = function() {
            $scope.loading = true;

            $http.get(commentUrl)
                .success(function(data) {
                    $scope.comments = _.sortBy(data.results, 'score').reverse();
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; //getComments()

        $scope.getComments();

        console.log($scope.comments);

        $scope.newComment = {rating: 1, name: '', title: '', body: '', score: 0};

        $scope.addComment = function() {
            $scope.loading = true;

            $http.post(commentUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {rating: 1, name: '', title: '', body: '', score: 0};
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; //addComment()

        $scope.incrementScore = function(comment, amt) {
            $http.put(commentUrl + '/' + comment.objectId, {
                score: {
                    __op: 'Increment',
                    amount: amt
                }
            })
                .success(function(responseData) {
                    console.log(responseData);
                    comment.score = responseData.score;
                })
                .error(function(err) {
                    console.log(err);
                });
//                .finally(function() {
//                    $scope.loading = false;
//                });
            console.log($scope.comments);
        }; //incrementScore()

        $scope.deleteComment = function(comment) {
            $scope.loading = true;

            $http.delete(commentUrl + '/' + comment.objectId)
                .success(function() {
                    $scope.getComments();
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }
    });