(function(angular) {
  'use strict';

  angular
    .module('webcorp90')
    .run(runSidenav);
     
    /** @ngInject */
    function runSidenav($rootScope,$templateCache,adminSidenavConstant){
        $rootScope.SidenavId=adminSidenavConstant.NAV_ID;
        
        $templateCache.put(adminSidenavConstant.MENU_LINK_TPL,
            '<div><md-button\n' +
            '   style-color="{\'background-color\': (vm.isSelected(vm.section.state) || vm.$state.includes(vm.section.state)) ? \'primary.800\': \'primary.default\'}"' +
            '   class="md-raised md-primary"' +
            '   ui-sref="{{vm.section.state}}"\n' +
            '   ng-click="vm.focusSection(vm.section)">\n' +
            //' <a href="#"><i class="fa fa-gear"/></a>'+
            '   <md-icon md-font-set="fa" >gear</md-icon>'+
            '   <md-icon md-font-icon="{{vm.section.faicon}}" class="fa {{vm.faSize(vm.section)}}"></md-icon>'+
            '   <md-icon ng-if="vm.section.mdicon" md-font-library="material-icons">{{vm.section.mdicon}}</md-icon>\n'+
            '   <span ng-if="vm.hasNoIcon(vm.section)" class="fa fa-facebook fa-2x fa-invisible"></span>\n'+
            '   {{vm.section.name}}\n' +
            '   <span class="md-visually-hidden"\n' +
            '       ng-if="vm.isSelected(vm.section.state)">\n' +
            '       current page\n' +
            '   </span>\n' +
            '</md-button></div>\n'
        );
         
        $templateCache.put(adminSidenavConstant.MENU_TOGGLE_TPL,
            '<div><md-button class="md-raised md-primary md-button-toggle"\n' +
            '   ng-click="vm.toggle(vm.section)"\n' +
            '   aria-controls="docs-menu-{{vm.section.name}}"\n' +
            '   aria-expanded="{{vm.isOpen(vm.section)}}">\n' +
            '   <div flex layout="row">\n' +
            '       {{vm.section.name}}\n' +
            '       <span flex></span>\n' +
            '       <span aria-hidden="true" class="md-toggle-icon"\n' +
            '           ng-class="{\'toggled\' : vm.isOpen(vm.section)}">\n' +
            '           <md-icon md-svg-src="md-toggle-arrow"></md-icon>\n' +
            '       </span>\n' +
            '   </div>\n' +
            '   <span class="md-visually-hidden">\n' +
            '       Toggle {{vm.isOpen(vm.section)? \'expanded\' : \'collapsed\'}}\n' +
            '   </span>\n' +
            '</md-button>\n' +
            '\n' +
            '<ul id="docs-menu-{{vm.section.name}}" class="menu-toggle-list">\n' +
            '   <li ng-repeat="page in vm.section.pages" ng-if="!page.hidden">\n' +
            '       <admin-sidenav-menu-link section="page"></admin-sidenav-menu-link>\n' +
            '   </li>\n' +
            '</ul>\n</div>'
        );

    }
})(angular);