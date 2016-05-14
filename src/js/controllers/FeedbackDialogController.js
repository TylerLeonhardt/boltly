/* global angular */
(function () {
  'use strict';

  angular.module('app')
    .controller('FeedbackDialogController', ($scope, $mdDialog, $http, $mdToast) => {
    $scope.feedback = '';

    $scope.send = function send() {
      if (!$scope.feedback || !$scope.feedback.trim().length) {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Please enter some feedback.')
            .hideDelay(3000)
          );

        return;
      }

      $http({
        method: 'POST',
        url: `https://getboltly.com/feedback?feedback=${$scope.feedback}`,
      }).success(data => {
        $mdToast.show(
          $mdToast.simple()
            .textContent(data)
            .hideDelay(3000)
          );
        $mdDialog.hide();
      }).error(() => {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Issues. Please try again. :(')
            .hideDelay(3000)
        );
      });
    };

    $scope.dismiss = function dismiss() {
      $mdDialog.hide();
    };
    });
})();
