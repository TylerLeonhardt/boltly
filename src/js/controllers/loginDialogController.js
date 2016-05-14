(function(){
  'use strict';

  angular.module('app')
         .controller('loginDialogController', ($scope, $mdDialog, $http, $mdToast) => {

    $scope.email = "";
    $scope.productKey = "";

    $scope.validate = function() {
      if(!$scope.email || !$scope.email.trim().length){
        $mdToast.show(
          $mdToast.simple()
            .textContent("Please enter an email.")
            .hideDelay(3000)
          );

         return;
      }

      if(!$scope.productKey || !$scope.productKey.trim().length){
        $mdToast.show(
          $mdToast.simple()
            .textContent("Please enter a product key.")
            .hideDelay(3000)
          );

        return;
      }

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
        if(status === 404){
          $mdToast.show(
          $mdToast.simple()
            .textContent("Record not found. :(")
            .hideDelay(3000)
          );
        }else{
          $mdToast.show(
          $mdToast.simple()
            .textContent("Issues. Please try again. :(")
            .hideDelay(3000)
          );
        }

        console.log("FFDFDSDFSFDS");
      });


        // $mdDialog.hide();
    }

  });
})();
