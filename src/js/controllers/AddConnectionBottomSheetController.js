/* global linkify */
(function() {
  'use strict';

  angular.module('app').controller('BottomSheetController', ($scope, $mdBottomSheet) => {
    $scope.newConnection = '';
    $scope.validURL = false;

    $scope.checkURL = () => {
      $scope.validURL = linkify.find($scope.newConnection).length;
    };

    $scope.createNewConnection = () => {
      const connectionObj = {
        url: $scope.newConnection,
        incomingHistory: [],
        outgoingHistory: [],
        trackedEvents: [],
        currentMsgEvent: '',
        currentMsgBody: '',
      };
      $mdBottomSheet.hide(connectionObj);
    };
  });
})();
