(function() {
    'use strict';

    let mod = angular.module('app');

    mod.controller('ConnectionsController', [
        '$scope', '$mdSidenav', '$mdBottomSheet', '$log', 'pouchDB',
        ConnectionsController
    ]);

    function ConnectionsController($scope, $mdSidenav, $mdBottomSheet, $log, pouchDB) {
        let db = pouchDB("local");
        /*
        LATER ADD SYNC CODE
        */

        $scope.remove = (item, $event) => {
            // do some code here
            db.remove(item);
            // Prevent bubbling to showItem.
            // On recent browsers, only $event.stopPropagation() is needed
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
            console.log(item);
        }

        $scope.connections = [];

        let error = (err) => $log.error(err);

        $scope.toggleHistory = () => $mdSidenav('left').toggle();

        // let get = res => {
        //   if (!res.ok) {
        //     return error(res);
        //   }
        //   return db.get(res.id);
        // }

        let addToConnections = res => {
            // $scope.connections.push(res);
            db.post(res);
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

        let getAllDocs = () => db.allDocs({ include_docs: true });


        // getAllDocs()
        // .then(result => $scope.connections = result.rows)
        // .catch(error);

        let onChange = (change) => {
          console.log(change);
          console.log(change.change.deleted);
          if(!change.change.deleted){
            $scope.connections.push(change.change.doc);
          }else {
            $scope.connections = $scope.connections.filter((connection) => (change.id !== connection._id));
          }
        }

        var options = {
          /*eslint-disable camelcase */
          include_docs: true,
          /*eslint-enable camelcase */
          live: true
        };

        db.changes(options).$promise
          .then(function(wow){console.dir(wow)}, function(wow){console.dir(wow)}, onChange);

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
