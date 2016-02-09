(function(angular,_){
    'use strict';
    var baseUrl='app/components/adminsidenav/';
    var prefix='adminSidenav';
    var provider=prefix+'Sections';
    var service=prefix + 'Service';
    var menu = prefix+'Menu';
    var menuToggle = prefix+'MenuToggle';
    var menuLink = prefix+'MenuLink';
    angular
    .module('webcorp90')
    .constant('adminSidenavConstant',{
        NAV_ID:'adminsidenav'
    })
    .constant("adminSidenavEvent",{
        CLICK:'click',
    })
    .constant('adminSidenavMessage',{
        FORCE_SELECTED_ITEM:'ADMIN_SIDENAV_FORCE_SELECTED_ITEM'
    })
    .provider(provider,adminSidenavProvider)
    .factory(prefix,adminSidenavFactory)
    .factory(service,adminSidenavService)
    .directive(prefix,adminSidenavDirective)
    .directive(menu,adminSidenavMenuDirective)
    .directive(menuToggle,adminSidenavMenuToggleDirective)
    .directive(menuLink,adminSidenavMenuLinkDirective)
    
     /** @ngInject */
    function adminSidenavProvider(){
        var _sections=[],
            _theme,
            _palettes;
        this.initSections = function(value){
            _sections = value ? value : [];
        };
        this.initTheme = function(value){
            _theme = value.theme();
            _palettes = value._PALETTES;
        };
        
        this.$get = function adminSidenavFactory(){
            var __sections= function(){
                this.sections = _sections;
                this.theme = _theme;
                this.palettes = _palettes;
            }
            return new __sections();
        }
    }
    
     /** @ngInject */
    function adminSidenavFactory($rootScope,$location,$state,$stateParams,adminSidenavSections,adminSidenavService){
        var self,sections=adminSidenavSections.sections;
        //console.dir(sections);
        var onStateChangeStart = function(event, toSate, toParams){
          var _state={toState:toSate,toParams:toParams};
          
          /*_.forEach(sections,function(section){
              
          });  */
        };
        
        self={
            sections:sections
        };
        
        $rootScope.$on('$stateChangeStart', onStateChangeStart);
        onStateChangeStart(null, $state.current, $stateParams);
        return self;
    }
    
    /** @ngInject */
    function adminSidenavService($rootScope){
        var _service={};
        _service.broadcast = function(eventName,eventData){
            $rootScope.$broadcast(eventName,eventData);
        };
        _service.emit = function(eventName,eventData){
            $rootScope.$emit(eventName,eventData);
        }
        return _service;
        
    }
    
    /** @ngInject */
    function adminSidenavDirective() { 
        var directive = {
            restrict:'E',
            templateUrl: baseUrl+'adminsidenav.html',
            controller: AdminSidenavController,
            controllerAs: 'vm',
            bindToController: true,
            scope:{
                isVisible:'=',
                menu:'='
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
            console.dir(vm.menu);
        }
    }
    
    /** @ngInject */
    function adminSidenavMenuDirective(){
        return {
            restrict:'E',
            replace:true,
            scope:{menu:'='},
            templateUrl: baseUrl+'menu.tpl.html',
            controllerAs:'vm',
            bindToController: true,
            controller:function(){
                var vm=this;
                console.dir(vm.menu);
            }
        }
    }
    /** @ngInject */
    function adminSidenavMenuToggleDirective($timeout,$animateCss){
        var directive ={
            restrict:'E',
            replace:true,
            scope:{
                section:'='
            },
            templateUrl: baseUrl+'menu-toggle.tpl.html',
            controller:MenuToggleController,
            controllerAs:'vm',
            bindToController:true,
            link:linker
        }
        return directive;
        /** @ngInject */
        function linker($scope,$element,$attrs,$ctrl){
            var _el_ul = $element.find('ul');

                var getTargetHeight = function() {
                    var _targetHeight;

                    _el_ul.addClass('no-transition');
                    _el_ul.css('height', '');

                    _targetHeight = _el_ul.prop('clientHeight');

                    _el_ul.css('height', 0);
                    _el_ul.removeClass('no-transition');

                    return _targetHeight;
                };

                if (!_el_ul) {
                    return console.warn('ss-sidenav: `menuToggle` cannot find ul element');
                }

                $scope.$watch(function() {
                    return $ctrl.isOpen($scope.section);
                }, function(open) {
                    $timeout(function() {
                        $animateCss(_el_ul, {
                            from: {
                                height: open ? 0 : (getTargetHeight() + 'px')
                            },
                            to: {
                                height: open ? (getTargetHeight() + 'px') : 0
                            },
                            duration: 0.3
                        }).start();
                    }, 0, false);
                });
        }
         /** @ngInject */
         function MenuToggleController($rootScope,$state,adminSidenav,adminSidenavService,adminSidenavMessage){
             var vm=this;
             vm.isOpen = function(section){
                 return adminSidenav.isSectionSelected(section);
             };
             vm.toggle = function(section){
                 adminSidenav.toggleSection(section);
             };
             
             $rootScope.$on(adminSidenavMessage.FORCE_SELECTED_ITEM,function(event,args){
                 if(vm.section && vm.section.pages)
                 _.forEach(vm.section.pages,function(page){
                    if(args === page.id){
                        vm.toggle(vm.section);
                        $state.go(page.state);
                    } 
                 });
             });
         }
        
    }
    /** @ngInject */
    function adminSidenavMenuLinkDirective(){
        var directive={
            restrict:'E',
            replace:true,
            scope:{
                section:'='
            },
            templateUrl: baseUrl + 'menu-link.tpl.html',
            controller:MenuLinkController,
            controllerAs:'vm',
            bindToController:true,
            
        };
        
        return directive
        
        /** @ngInject */
        function MenuLinkController($state,$mdSidenav,adminSideNav,adminSideNavService){
            var vm=this;
            
            vm.isSelected = function(page){
                return adminSideNav.isPageSelected(page);
            }
            
            vm.focusSection = function(item){
                $mdSidenav('left').close();
                adminSideNavService.broadcast('SS_SIDENAV_CLICK_ITEM', item);
            }
        }
    }
})(angular,_);