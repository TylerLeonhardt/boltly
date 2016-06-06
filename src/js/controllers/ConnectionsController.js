(function() {
  'use strict';

  angular
  .module('app')
  .controller('ConnectionsController', ConnectionsController);

	ConnectionsController.$inject = ['$scope', '$mdSidenav', '$mdBottomSheet', '$log', 'pouchDB', 'socket', '$mdDialog', '$mdToast'];

  function ConnectionsController ($scope, $mdSidenav, $mdBottomSheet, $log, pouchDB, socket, $mdDialog) {
    const db = pouchDB('local');
    /*
    LATER ADD SYNC CODE
    */

    if (localStorage.getItem('registered') !== 'true' || !localStorage.getItem('registered')) {
      $mdDialog.show({
        escapeToClose: false,
        templateUrl: 'views/login-dialog.html',
        controller: 'loginDialogController',
      });
    }
    $scope.format = str => {
      try {
        return angular.toJson(str, 2);
      } catch (e) {}

      return str;
    };
	
	/*Disposes the binding data and CSS class ng-binding attached to the corresponding element to boost the production run*/
	app.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
	}]);

    $scope.remove = (index, $event) => {
      db.get($scope.connections[index]._id)
        .then((doc) => {
          db.remove(doc);
        })
        .catch(err => $log.error(err));

      // Prevent bubbling to item.
      // On recent browsers, only $event.stopPropagation() is needed
      if ($event.stopPropagation) $event.stopPropagation();
      if ($event.preventDefault) $event.preventDefault();
      $event.cancelBubble = true;
      $event.returnValue = false;
    };

    $scope.connections = [];
    $scope.sockets = [];
    $scope.tabs = {
      hovered: [],
      selectedIndex: 0,
      next: () => { $scope.tabs.selectedIndex = Math.min($scope.tabs.selectedIndex + 1, 2); },
      previous: () => { $scope.tabs.selectedIndex = Math.max($scope.tabs.selectedIndex - 1, 0); },
    };

    $scope.hoverIn = i => { $scope.tabs.hovered[i] = true; };
    $scope.hoverOut = i => { $scope.tabs.hovered[i] = false; };
    $scope.toggleHistory = () => { $mdSidenav('left').toggle(); };

    $scope.addEvent = (evt, i) => {
      const now = new Date();
      const storeIncomingHistory = (event, data) => {
        db.get($scope.connections[i]._id).then(doc => {
          doc.incomingHistory.push({ event: event, msg: data, receivedAt: now.toLocaleTimeString() + ' ' + now.toLocaleDateString() });
          return db.put(doc);
        }).then(() => {}).catch(err => {
          if (err.status === 409) {
            storeIncomingHistory(evt, data);
          } else {
            $log.error(err);
          }
        });
      };
      $scope.sockets[i].on(evt, data => {
        $scope.connections[i].incomingHistory.push({ event: evt, msg: data, recievedAt: now.toLocaleTimeString() + ' ' + now.toLocaleDateString() });
        storeIncomingHistory(evt, data);
      });

      const storeTrackedEvents = event => {
        db.get($scope.connections[i]._id).then(doc => {
          doc.trackedEvents.push(event);
          return db.put(doc);
        }).then(response => {}).catch(err => {
          if (err.status === 409) {
            storeTrackedEvents(event);
          } else {
            $log.error(err);
          }
        });
      };
      storeTrackedEvents(evt);
    };
    $scope.removeEvent = (evt, i) => {
      $scope.sockets[i].removeAllListeners(evt);
      const storeRemoveEvent = () => {
        db.get($scope.connections[i]._id).then(doc => {
          doc.trackedEvents.splice(doc.trackedEvents.indexOf(evt), 1);
          return db.put(doc);
        }).then(() => {}).catch(err => {
          if (err.status === 409) {
            storeRemoveEvent();
          } else {
            $log.error(err);
          }
        });
      };
      storeRemoveEvent();
    };

    $scope.changeTheme = () => {
      const classes = document.querySelector('body').classList;

      if (classes.contains('dark-theme')) {
        classes.add('light-theme');
        classes.remove('dark-theme');
        document.querySelector('#theme_instr').innerHTML = 'Switch to dark theme';
      } else if (classes.contains('light-theme')) {
        classes.add('dark-theme');
        classes.remove('light-theme');
        document.querySelector('#theme_instr').innerHTML = 'Switch to light theme';
      }
    };

    $scope.sendMessage = (evt, msg, i) => {
      let send = msg;
      try {
        send = angular.fromJson(msg);
      } catch (e) {}
      $scope.sockets[i].emit(evt, send);
      const now = new Date();
      $scope.connections[i].outgoingHistory.unshift({ event: evt, msg: msg, sentAt: now.toLocaleTimeString() + ' ' + now.toLocaleDateString() });
      const storeOutgoingHistory = () => {
        db.get($scope.connections[i]._id).then(doc => {
          doc.outgoingHistory.unshift({ event: evt, msg: msg, sentAt: now.toLocaleTimeString() + ' ' + now.toLocaleDateString() });
          return db.put(doc);
        }).then(() => {}).catch(err => {
          if (err.status === 409) {
            storeOutgoingHistory();
          } else {
            $log.error(err);
          }
        });
      };
      storeOutgoingHistory();

      // Reset Send Message UI UI
      $scope.connections[$scope.tabs.selectedIndex].currentMsgEvent = '';
      $scope.connections[$scope.tabs.selectedIndex].currentMsgBody = '';
    };

    const addToConnections = res => db.post(res);
    $scope.showListBottomSheet = () => {
      $mdBottomSheet.show({
        templateUrl: 'views/add-connection-bottom-sheet.html',
        controller: 'BottomSheetController',
      })
        // .then(db.post)
        // .then(get)
        .then(addToConnections)
        .catch($log.error);
    };

    $scope.showFeedbackDialog = () => {
      $mdDialog.show({
        templateUrl: 'views/feedback-dialog.html',
        controller: 'FeedbackDialogController',
      })
        .catch($log.error);
    };

    const onChange = (change) => {
      const index = $scope.connections.findIndex(connection => change.change.id === connection._id);
      if (!change.change.deleted) {
        if (index === -1) {
          const tempSocket = new socket(change.change.doc.url);
          tempSocket.connected = false;

          tempSocket.on('connect', () => {
            $log.info(' [Socket.io] Client has connected to: ' + change.change.doc.url);
            tempSocket.connected = true;
          });
          tempSocket.on('disconnect', () => {
            $log.info(' [Socket.io] The client has disconnected from: ' + change.change.doc.url);
            tempSocket.connected = false;
          });

          const now = new Date();
          for (let evt of change.change.doc.trackedEvents) {
            const storeTrackedEvents = (event, data) => {
              db.get(change.change.doc._id).then(doc => {
                doc.incomingHistory.push({ event: event, msg: data, receivedAt: now.toLocaleTimeString() + ' ' + now.toLocaleDateString() });
                return db.put(doc);
              }).then(() => {}).catch(err => {
                if (err.status === 409) {
                  storeTrackedEvents(event, data);
                } else {
                  $log.error(err);
                }
              });
            };
            tempSocket.on(evt, data => {
              change.change.doc.incomingHistory.push({ event: evt, msg: data, receivedAt: now.toLocaleTimeString() + ' ' + now.toLocaleDateString() });
              storeTrackedEvents(evt, data);
            });
          }

          $scope.sockets.push(tempSocket);
          $scope.tabs.hovered.push(false);
          $scope.connections.push(change.change.doc);
        }
      } else {
        if (index !== -1) {
          $scope.connections.splice(index, 1);
          $scope.sockets[index].disconnect();
          $scope.sockets.splice(index, 1);
          $scope.tabs.hovered.splice(index, 1);
        }
      }
    };

    $scope.setMsg = (outgoingHistoryObject) => {
      let msg = outgoingHistoryObject.msg;
      if (angular.isObject(outgoingHistoryObject.msg)) {
        msg = angular.toJson(msg, 2);
      }

      $scope.connections[$scope.tabs.selectedIndex].currentMsgEvent = outgoingHistoryObject.event;
      $scope.connections[$scope.tabs.selectedIndex].currentMsgBody = msg;
    };

    const options = { include_docs: true, live: true };
    db.changes(options).$promise
      .then(wow => { console.dir(wow); }, wow => { console.dir(wow); }, onChange);
  };
})();
