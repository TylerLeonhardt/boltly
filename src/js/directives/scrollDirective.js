/* global angular */
/* eslint no-param-reassign: [2, { "props": false }] */
/* eslint arrow-body-style: [2, "always"] */

angular.module('app')
.directive('ngScrollBottom', ['$timeout', ($timeout) => {
  return {
    scope: {
      ngScrollBottom: '=',
    },
    link: ($scope, $element) => {
      $scope.$watchCollection('ngScrollBottom', (newValue) => {
        if (newValue) {
          $timeout(() => {
            $element[0].scrollTop = $element[0].scrollHeight;
          }, 0);
        }
      });
    },
  };
}]);
