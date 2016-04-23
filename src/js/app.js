/* global angular */
angular.module('app', [
    'ngMaterial',
    'pouchdb',
    'btford.socket-io',
    'ui.ace'
]).config(($mdThemingProvider, $mdIconProvider, pouchDBProvider, POUCHDB_METHODS) => {
    $mdIconProvider.defaultIconSet('./assets/svg/avatars.svg', 128)
        .icon('menu', './assets/svg/menu.svg', 24)
        .icon('more_vert_white', './assets/svg/more_vert_white.svg', 24)
        .icon('palette_white', './assets/svg/palette_white.svg', 24)
        .icon('flash_on_white', './assets/svg/flash_on_white.svg', 24)
        .icon('share', './assets/svg/share.svg', 24)
        .icon('history', './assets/svg/history_white.svg', 24)
        .icon('google_plus', './assets/svg/google_plus.svg', 512)
        .icon('hangouts', './assets/svg/hangouts.svg', 512)
        .icon('twitter', './assets/svg/twitter.svg', 512)
        .icon('phone', './assets/svg/phone.svg', 512);

    var upsertMethods = {
      upsert: 'qify',
      putIfNotExists: 'qify'
    };
    pouchDBProvider.methods = angular.extend({}, POUCHDB_METHODS, upsertMethods);

    //NOTE FOR AUTH LATER
    // var authMethods = {
    //   login: 'qify',
    //   logout: 'qify',
    //   getUser: 'qify'
    // };
    // pouchDBProvider.methods = angular.extend({}, POUCHDB_METHODS, authMethods);
});