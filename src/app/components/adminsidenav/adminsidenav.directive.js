(function(angular){
    'use strict';
    angular
    .module('webcorp90')
    .directive('adminSidenav',adminSidenav)
    
    /** @ngInject */
    function adminSidenav() { 
        var directive = {
            restrict:'E',
            templateUrl: 'app/components/adminsidenav/adminsidenav.html',
            controller: AdminSidenavController,
            controllerAs: 'vm',
            bindToController: true,
            scope:{
                isVisible:'='
            }
        }
        return directive;
        
        /** @ngInject */
        function AdminSidenavController($log,$scope,$mdComponentRegistry,$mdSidenav,$mdUtil){
            var vm=this;
            
            vm.close = function(){
                $mdSidenav('adminsidenav').close();
                    
                vm.isVisible=false;
            };
            vm.open = function(){
                vm.isVisible=true;
            }
        }
    }
})(angular);