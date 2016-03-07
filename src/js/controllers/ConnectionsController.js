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
            // Prevent bubbling to item.
            // On recent browsers, only $event.stopPropagation() is needed
            if ($event.stopPropagation) $event.stopPropagation();
            if ($event.preventDefault) $event.preventDefault();
            $event.cancelBubble = true;
            $event.returnValue = false;
        }

        $scope.connections = [];
        $scope.sockets = [];
        $scope.tabs = {
            hovered:[],
            selectedIndex: 0,
            next: () => $scope.tabs.selectedIndex = Math.min($scope.tabs.selectedIndex + 1, 2),
            previous: () => $scope.tabs.selectedIndex = Math.max($scope.tabs.selectedIndex - 1, 0)
        };

        $scope.hoverIn = (i) => $scope.tabs.hovered[i] = true;
        $scope.hoverOut = (i) => $scope.tabs.hovered[i] = false;
        $scope.toggleHistory = () => $mdSidenav('left').toggle();

        $scope.sendMessage = (evt, msg, i) => {
          try {
              msg = JSON.parse(msg);
          }
          catch (e) { }
          console.log("FIRE: " + evt + " " + msg);
          $scope.sockets[i].emit(evt, msg);
          $scope.connections[i].outgoingHistory.push({"event":evt, "msg":msg});

          db.get($scope.connections[i]._id).then(function(doc) {
            console.log(doc)
            doc.outgoingHistory.push({"event":evt, "msg":msg});
            return db.put({
              _id: doc._id,
              _rev: doc._rev,
              outgoingHistory: doc.outgoingHistory,
              url:doc.url,
              incomingHistory:doc.incomingHistory,
              outgoingHistory:doc.outgoingHistory,
              trackedEvents:doc.trackedEvents,
              currentMsgEvent: doc.currentMsgEvent,
              currentMsgBody: doc.currentMsgBody
            });
          }).then(function(response) {
            // handle response
            console.log(response);
          }).catch(function (err) {
            console.log(err);
          });
        }

        let addToConnections = res => db.post(res);
        $scope.showListBottomSheet = () => {
            $mdBottomSheet.show({
                    templateUrl: 'views/add-connection-bottom-sheet.html',
                    controller: 'BottomSheetCtrl'
                })
                // .then(db.post)
                // .then(get)
                .then(addToConnections)
                .catch($log.error);
        };

        let onChange = (change) => {
          let index = $scope.connections.findIndex((connection, index, array) => change.change.id === connection._id);
          if(!change.change.deleted){
            if(index == -1){
              let tempSocket = new socket(change.change.doc.url);
              tempSocket.connected = false;

              tempSocket.on('connect',function() {
                $log.info(' [Socket.io] Client has connected to: ' + change.change.doc.url);
                tempSocket.connected = true;
              });
              tempSocket.on('disconnect',function() {
                $log.info(' [Socket.io] The client has disconnected from: ' + change.change.doc.url);
                tempSocket.connected = false;
              });
              $scope.sockets.push(tempSocket);
              $scope.tabs.hovered.push(false);
              $scope.connections.push(change.change.doc);
            }
          }else {
            if(index != -1){
              $scope.connections.splice(index, 1);
              $scope.sockets[index].disconnect();
              $scope.sockets.splice(index, 1);
              $scope.tabs.hovered.splice(index, 1);
            }
          }
        }

        let options = { include_docs: true, live: true };
        db.changes(options).$promise
          .then(function(wow){console.dir(wow)}, function(wow){console.dir(wow)}, onChange);
    }
})();
