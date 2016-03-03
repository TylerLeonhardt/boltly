(function(){
  'use strict';

  angular.module('app').factory('socket', function (socketFactory) {
  return url => socketFactory({
    ioSocket: io.connect(url)
  });
})

})();
