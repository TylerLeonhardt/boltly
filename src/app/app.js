angular
  .module('starterApp', ['ngMaterial', 'users'])
  .config(function($mdThemingProvider, $mdIconProvider){

      $mdThemingProvider.definePalette('darkRich', {
        '50': 'a4acb4',
        '100': '8d98a1',
        '200': '76838e',
        '300': '606e7c',
        '400': '495a69',
        '500': '324556',
        '600': '1c3144',
        '700': '192c3d',
        '800': '162736',
        '900': '13222f',
        'A100': '101d28',
        'A200': '0e1822',
        'A400': '0b131b',
        'A700': '080e14',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400'],
        'contrastLightColors': ['A700', 'A400', 'A200', 'A100']    // could also specify this if default was 'dark'
      });
      $mdIconProvider
          .defaultIconSet("./assets/svg/avatars.svg", 128)
          .icon("menu"       , "./assets/svg/menu.svg"        , 24)
          .icon("more_vert_white"  , "./assets/svg/more_vert_white.svg"   , 24)
          .icon("share"      , "./assets/svg/share.svg"       , 24)
          .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
          .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
          .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
          .icon("phone"      , "./assets/svg/phone.svg"       , 512);

          $mdThemingProvider.theme('default')
              .primaryPalette('darkRich', {
                'default': '600', // by default use shade 400 from the darkRich palette for primary intentions
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': 'A100' // use shade A100 for the <code>md-hue-3</code> class
              })
              .accentPalette('purple')
              .backgroundPalette('darkRich', {
                'default': '600', // by default use shade 400 from the darkRich palette for primary intentions
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': 'A100' // use shade A100 for the <code>md-hue-3</code> class
              })
              .dark();
  });
