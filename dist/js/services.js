'use strict';

(function () {
  'use strict';

  angular.module('app').service('PouchDBService', ['pouchDB', function (pouchDB) {
    return pouchDB('local');
  }]);
})();