(function(){
  'use strict';

  angular.module('app')
         .controller('loginDialogController', ($scope, $mdDialog, $http, $mdToast) => {

    $scope.email = "";
    $scope.productKey = "";

    $scope.validate = function() {
      $http({
        method: 'GET',
        url: `https://getboltly.com/register?email=${$scope.email}&product_key=${$scope.productKey}`
      }).success(function(data, status, headers, config) {
          $mdToast.show(
            $mdToast.simple()
              .textContent(data)
              .hideDelay(3000)
            );
          localStorage.setItem('registered', true);
          $mdDialog.hide();
      }).error(function(data, status, headers, config){
        $mdToast.show(
          $mdToast.simple()
            .textContent(data)
            .hideDelay(3000)
          );
      });


        // $mdDialog.hide();
    }

  });
})();
