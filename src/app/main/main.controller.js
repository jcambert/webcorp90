(function(angular) {
  'use strict';

  angular
    .module('webcorp90')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($log,$timeout, webDevTec, toastr,$mdUtil,$mdSidenav) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1454180974110;
    vm.showToastr = showToastr;
	vm.isMenuVisible=true;
    vm.toggleMenu = buildToggle('adminsidenav');
    activate();

    function activate() {
      getWebDevTec();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
    
    function buildToggle(navID) {
        var debounceFn =  $mdUtil.debounce(function(){
                $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
            },300);

        return debounceFn;
        }
  }
})(angular);
