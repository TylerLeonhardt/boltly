(function() {
    'use strict';

    let mod = angular.module('app');

    mod.controller('ConnectionsController', [
        '$scope', '$mdSidenav', '$mdBottomSheet', '$log', 'pouchDB', 'socket',
        ConnectionsController
    ]);

    function ConnectionsController($scope, $mdSidenav, $mdBottomSheet, $log, pouchDB, socket) {
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
        $scope.sockets = [];
        $scope.hovered =[];

        $scope.hoverIn = (i) => $scope.hovered[i] = true;
        $scope.hoverOut = (i) => $scope.hovered[i] = false;
        let error = (err) => $log.error(err);

        $scope.toggleHistory = () => $mdSidenav('left').toggle();

        // let get = res => {
        //   if (!res.ok) {
        //     return error(res);
        //   }
        //   return db.get(res.id);
        // }

        let addToConnections = res => {
            db.post(res);
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

        let onChange = (change) => {
          console.log(change);
          if(!change.change.deleted){
            let tempSocket = new socket(change.change.doc.url);
            tempSocket.connected = false;

            tempSocket.on('connect',function() {
              console.log('Client has connected to: ' + change.change.doc.url);
              tempSocket.connected = true;
            });
            tempSocket.on('disconnect',function() {
              console.log('The client has disconnected from: ' + change.change.doc.url);
              tempSocket.connected = false;
            });
            $scope.sockets.push(tempSocket);
            $scope.hovered.push(false);
            $scope.connections.push(change.change.doc);
          }else {
            let index = $scope.connections.findIndex((connection, index, array) => change.change.id === connection._id);
            if(index != -1){
              $scope.connections.splice(index, 1);
              $scope.sockets[index].disconnect();
              $scope.sockets.splice(index, 1);
              $scope.hovered.splice(index, 1);
            }
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
