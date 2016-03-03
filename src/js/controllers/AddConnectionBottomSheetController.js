(function(){
  'use strict';

  angular.module('app')
         .controller('BottomSheetCtrl', ($scope, $mdBottomSheet) => {

    $scope.newConnection = "";

    $scope.createNewConnection = () => {
      let connectionObj = {
        url:$scope.newConnection,
        incomingHistory:["test","wow"],
        outgoingHistory:["wow"],
        trackedEvents:[]
      };
      $mdBottomSheet.hide(connectionObj);
    };
  });
})();
