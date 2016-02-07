(function(angular) {
  'use strict';

  angular
    .module('webcorp90')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})(angular);
