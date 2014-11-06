"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var commentUrl = 'https://api.parse.com/1/classes/comments';

angular.module('ReviewApp', [])
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
                    $scope.comments = data.results;
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };

        $scope.getComments();

        $scope.newComment = {rating: null, name: '', title: '', body: '', score: 0};
        $scope.addComment = function() {
            $http.post(commentUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.loading = true;
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {rating: null, name: '', title: '', body: '', score: 0};
                })
                .error(function() {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };
    });