(function() {
    'use strict';

    let mod = angular.module('app');

    mod.controller('ConnectionsController', [
        '$scope', '$mdSidenav', '$mdBottomSheet', '$log',
        ConnectionsController
    ]);

    function ConnectionsController($scope, $mdSidenav, $mdBottomSheet, $log) {

        // console.log(pouchDB);
        // let db = pouchDB();
        /*
        LATER ADD SYNC CODE
        */

        let error = (err) => $log.error(err);

        $scope.toggleHistory = () => $mdSidenav('left').toggle();

        // let get = res => {
        //   if (!res.ok) {
        //     return error(res);
        //   }
        //   return db.get(res.id);
        // }

        let addToConnections = res => {
            $scope.connections.push(res);
            console.log($scope.connections)
        }

        $scope.showListBottomSheet = () => {
            $mdBottomSheet.show({
                    templateUrl: 'views/add-connection-bottom-sheet.html',
                    controller: 'BottomSheetCtrl'
                })
                // .then(db.post)
                // .then(get)
                .then(addToConnections)
                .catch(error);
        };

        // let getAllDocs = () => db.allDocs({ include_docs: true });


        // getAllDocs()
        // .then(result => $scope.connections = result.rows)
        // .catch(error);

        $scope.connections = [];

        $scope.tabs = {
            selectedIndex: 0,
            next: function() {
                $scope.tabs.selectedIndex = Math.min($scope.tabs.selectedIndex + 1, 2);
            },
            previous: function() {
                $scope.tabs.selectedIndex = Math.max($scope.tabs.selectedIndex - 1, 0);
            }
        };
    }
})();
