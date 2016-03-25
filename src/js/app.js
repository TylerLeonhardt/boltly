/* global angular */
angular.module('app', [
    'ngMaterial',
    'pouchdb',
    'btford.socket-io',
    'ui.ace'
]).config(($mdThemingProvider, $mdIconProvider, pouchDBProvider, POUCHDB_METHODS) => {
    // $mdThemingProvider.definePalette('myLightTheme', {
    //     '50': '#FFFFFF',
    //     '100': '#800080',
    //     '200': '#0000FF',
    //     '300': '#E364FF',
    //     '400': '#FF0000',
    //     '500': '#FFFF00',
    //     '600': '#EFEEEE', // background
    //     '700': '#FFC0CB',
    //     '800': '#008080',
    //     '900': '#FFA500',
    //     'A100': '#FFD700',
    //     'A200': '#1C3144',
    //     'A400': '#FF00FF',
    //     'A700': '#00FFFF'
    // });
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

    // $mdThemingProvider.theme('default').primaryPalette('myLightTheme', {
    //     'default': '600',
    //     'hue-1': 'A400',
    //     'hue-2': 'A100',
    //     'hue-3': 'A700'
    // }).accentPalette('myLightTheme', {
    //   'default': '200', // use shade 200 for default, and keep all other shades the same
    //   'hue-1': '700',
    //   'hue-2': 'A400',
    //   'hue-3': '300'
    // }).backgroundPalette('myLightTheme', {
    //   'default': '600',
    //   'hue-1': '700',
    //   'hue-2': 'A400',
    //   'hue-3': '300'
    // }).warnPalette('myLightTheme', {
    //   'default': '200',
    //   'hue-1': 'A400',
    //   'hue-2': 'A100',
    //   'hue-3': 'A700'
    // });


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
