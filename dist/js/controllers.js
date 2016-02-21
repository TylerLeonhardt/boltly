'use strict';

(function () {
    'use strict';

    angular.module('app').controller('BottomSheetCtrl', function ($scope, $mdBottomSheet) {

        $scope.newConnection = "";

        $scope.createNewConnection = function () {
            var connectionObj = {
                url: $scope.newConnection,
                incomingHistory: [],
                outgoingHistory: [],
                trackedEvents: []
            };
            $mdBottomSheet.hide(connectionObj);
        };
    });
})();

(function () {
    'use strict';

    var mod = angular.module('app');

    mod.controller('ConnectionsController', ['$scope', '$mdSidenav', '$mdBottomSheet', '$log', ConnectionsController]);

    function ConnectionsController($scope, $mdSidenav, $mdBottomSheet, $log) {

        // console.log(pouchDB);
        // let db = pouchDB();
        /*
        LATER ADD SYNC CODE
        */

        var error = function error(err) {
            return $log.error(err);
        };

        $scope.toggleHistory = function () {
            return $mdSidenav('left').toggle();
        };

        // let get = res => {
        //   if (!res.ok) {
        //     return error(res);
        //   }
        //   return db.get(res.id);
        // }

        var addToConnections = function addToConnections(res) {
            $scope.connections.push(res);
            console.log($scope.connections);
        };

        $scope.showListBottomSheet = function () {
            $mdBottomSheet.show({
                templateUrl: 'views/add-connection-bottom-sheet.html',
                controller: 'BottomSheetCtrl'
            })
            // .then(db.post)
            // .then(get)
            .then(addToConnections).catch(error);
        };

        // let getAllDocs = () => db.allDocs({ include_docs: true });

        // getAllDocs()
        // .then(result => $scope.connections = result.rows)
        // .catch(error);

        $scope.connections = [{ url: "test" }];

        $scope.tabs = {
            selectedIndex: 0,
            next: function next() {
                $scope.tabs.selectedIndex = Math.min($scope.tabs.selectedIndex + 1, 2);
            },
            previous: function previous() {
                $scope.tabs.selectedIndex = Math.max($scope.tabs.selectedIndex - 1, 0);
            }
        };
    }
})();