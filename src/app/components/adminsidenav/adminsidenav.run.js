(function(angular) {
  'use strict';

  angular
    .module('webcorp90')
    .run(runSidenav);
    
    /** @ngInject */
    function runSidenav($rootScope,adminSidenavConstant){
        $rootScope.SidenavId=adminSidenavConstant.NAV_ID;
    }
})(angular);