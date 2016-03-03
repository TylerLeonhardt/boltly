(function(){
  'use strict';

  class SocketIOService {
    constructor(){
        this.db = new PouchDB('local');
    }

    load() {
      //TODO: Need to load from PouchDB
      return Promise.resolve(db.allDocs({ include_docs: true }));
    }


  }

  angular.module('app').service('SocketIOService', SocketIOService);

})();
