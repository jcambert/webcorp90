(function(angular){
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
        NAV_ID:'adminsidenav',
        MENU_TOGGLE_TPL:baseUrl + 'menu-toggle.tpl.html',
        MENU_LINK_TPL:baseUrl + 'menu-link.tpl.html'
    })
    .constant("adminSidenavEvent",{
        CLICK:'click'
    })
    .constant('adminSidenavMessage',{
        FORCE_SELECTED_ITEM:'ADMIN_SIDENAV_FORCE_SELECTED_ITEM',
        SIDENAV_CLICK_ITEM:'ADMIN_SIDENAV_CLICK_ITEM'
    })
    .provider(provider,adminSidenavProvider)
    .factory(prefix,adminSidenavFactory)
    .factory(service,adminSidenavService)
    .directive(prefix,adminSidenavDirective)
    .directive(menu,adminSidenavMenuDirective)
    .directive(menuToggle,adminSidenavMenuToggleDirective)
    .directive(menuLink,adminSidenavMenuLinkDirective)
    .directive('styleColor',AdminSidenavStyleColorDirective)
    

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
        
        this.$get = [function adminSidenavFactory(){
            var __sections= function(){
                this.sections = _sections;
                this.theme = _theme;
                this.palettes = _palettes;
            }
            return new __sections();
        }];
    }
    
     /** @ngInject */
    function adminSidenavFactory($rootScope,$location,$state,$stateParams,$log,adminSidenavSections,adminSidenavService,adminSidenavMessage){
        var self,sections=adminSidenavSections.sections;
        //console.dir(sections);
        var onStateChangeStart = function(event, toSate, toParams){
          var newState={toState:toSate,toParams:toParams};
           var matchPage = function(section, page, newState) {
                var toState = newState ? newState.toState : null;

                if (!toState) {
                    return $log.warn('ss-sidenav: `toState` key not found');
                }

                if (toState.name !== page.state) {
                    return;
                }

                if (!self) {
                    $log.warn('ss-sidenav: strange `self` is undef');
                    return;
                }

                self.selectSection(section);
                self.selectPage(section, page);
            };
          sections.forEach(function(section) {
                if (section.children) {
                    section.children.forEach(function(child) {
                        if (child.pages) {
                            child.pages.forEach(function(page) {
                                matchPage(child, page, newState);
                            });
                        } else if (child.type === 'link') {
                            matchPage(child, child, newState);
                        }
                    });
                } else if (section.pages) {
                    section.pages.forEach(function(page) {
                        matchPage(section, page, newState);
                    });
                } else if (section.type === 'link') {
                    matchPage(section, section, newState);
                }
            });
        };
        
        self={
            sections:sections,
            forceSelectionWithId: function (id) {
                adminSidenavService.broadcast(adminSidenavMessage.FORCE_SELECTED_ITEM, id);
            },
            selectSection: function(section) {
                self.openedSection = section;
            },
            toggleSelectSection: function(section) {
                self.openedSection = (self.openedSection === section) ? null : section;
            },
            isSectionSelected: function(section) {
                return self.openedSection === section;
            },
            selectPage: function(section, page) {
                self.currentSection = section;
                self.currentPage = page;
            },
            isPageSelected: function(page) {
                return self.currentPage ? self.currentPage.state === page : false;
            },
            setVisible: function (id, value) {
                if (!Array.prototype.every) {
                    // TODO prototyp for every,
                    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every;
                    return $log.error('every funct not implemented');
                }

                self.sections.every(function (section) {
                    if (section.id === id) {
                        section.hidden = !value;
                        return false;
                    }

                    if (section.children) {
                        section.children.every(function (child) {
                            if (child.id === id) {
                                child.hidden = !value;
                                return false;
                            }

                            if (child.pages) {
                                child.pages.every(function (page) {
                                    if (page.id === id) {
                                        page.hidden = !value;
                                        return false;
                                    }
 
                                    return true;
                                });
                            }

                            return true;
                        });
                    }

                    return true;
                });
            },
            setVisibleFor: function (ids) {
                if (!Array.prototype.every) {
                    // TODO prototyp for every,
                    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every;
                    return $log.error('every funct not implemented');
                }

                ids.forEach(function (id) {
                    self.setVisible(id.id, id.value);
                });
            }
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
        function AdminSidenavController($log,$scope,$mdComponentRegistry,$mdSidenav,$mdUtil,adminSidenavConstant){
            var vm=this;
            
            vm.close = function(){
                $mdSidenav(adminSidenavConstant.NAV_ID).close();
                    
                vm.isVisible=false;
            };
            vm.open = function(){
                vm.isVisible=true;
            };
           //console.dir(vm.menu);
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
              //  var vm=this;
                //console.dir(vm.menu);
            }
        }
    }
    /** @ngInject */
    function adminSidenavMenuToggleDirective($timeout,$animateCss,$log){
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
                    return $log.warn('ss-sidenav: `menuToggle` cannot find ul element');
                }

                $scope.$watch(function() {
                    return $ctrl.isOpen($ctrl.section);
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
         function MenuToggleController($rootScope,$state,$log,adminSidenav,adminSidenavService,adminSidenavMessage){
             var vm=this;
             vm.isOpen = function(section){
                 return adminSidenav.isSectionSelected(section);
             };
             vm.toggle = function(section){
                 $log.log('toggle section ');$log.log(section);
                 adminSidenav.toggleSelectSection(section);
             };
             $log.log(vm.section);
             $rootScope.$on(adminSidenavMessage.FORCE_SELECTED_ITEM,function(event,args){
                 if(vm.section && vm.section.pages){
                    for (var i = vm.section.pages.length - 1; i >= 0; i--) {
                        var _e = vm.section.pages[i];

                        if (args === _e.id) {
                            vm.toggle(vm.section);
                            $state.go(_e.state);
                        }
                    }
                 }
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
            bindToController:true
            
        };
        
        return directive;
        
        /** @ngInject */
        function MenuLinkController($state,$mdSidenav,$log,adminSidenav,adminSidenavService,adminSidenavMessage,adminSidenavConstant){
            var vm=this;
            $log.log(vm.section);
            vm.isSelected = function(page){
                return adminSidenav.isPageSelected(page);
            };
            
            vm.focusSection = function(item){
                $mdSidenav(adminSidenavConstant.NAV_ID).close();
                adminSidenavService.broadcast(adminSidenavMessage.SIDENAV_CLICK_ITEM, item);
            };
            this.$state=$state;
            
            vm.hasIcon = function(page){
                //$log.log(page);
                
                var result= page.faicon!=undefined || page.mdicon!=undefined;
                //$log.log(result);
                return result;
            } 
            
            vm.hasNoIcon = function(page){
                return !vm.hasIcon(page);
            }
            
            vm.faSize = function(page){
                if(page.faicon!=undefined){
                    if(page.fasize !=undefined)
                        return "fa-" + page.fasize;
                    else
                        return "fa-2x";
                }
                return "";
            }
        }
    }
    
    /** @ngInject */
    function AdminSidenavStyleColorDirective($log,adminSidenavSections){
     var directive ={
         restrict:'A',
         scope:{
             styleColor:'='
         },
         link:link
     }   
     return directive;
     
    
     function link($scope,$element){
         var _apply_color = function () {
            for (var p in $scope.ssStyleColor) {
                if ($scope.ssStyleColor.hasOwnProperty(p)) {
                    var themeColors = adminSidenavSections.theme.colors,
                        split = ($scope.ssStyleColor[p] || '').split('.'),
                        hueR,
                        colorR,
                        colorA,
                        hueA,
                        colorValue;

                    if (split.length < 2) {
                        split.unshift('primary');
                    }

                    hueR = split[1] || 'hue-1'; // 'hue-1'
                    colorR = split[0] || 'primary'; // 'warn'

                    // Absolute color: 'orange'
                    colorA = themeColors[colorR] ? themeColors[colorR].name : colorR;

                    // Absolute Hue: '500'
                    hueA = themeColors[colorR] ? (themeColors[colorR].hues[hueR] || hueR) : hueR;

                    colorValue = adminSidenavSections.palettes[colorA][hueA] ? adminSidenavSections.palettes[colorA][hueA].value : adminSidenavSections.palettes[colorA]['500'].value;

                    $element.css(p, 'rgb(' + colorValue.join(',') + ')');

                    // Add color to md-sidenav
                    if($element.parent().attr('md-component-id')) $element.parent().css(p, 'rgb(' + colorValue.join(',') + ')');
                }
            }
        };

        if (!adminSidenavSections.theme || !adminSidenavSections.palettes) {
            return $log.warn('ss-sidenav: you probably want to ssSideNavSectionsProvider.initWithTheme($mdThemingProvider)');
        }

        $scope.$watch('styleColor', function (oldVal, newVal) {
            if ((oldVal && newVal) && oldVal !== newVal) {
                _apply_color();
            }
        });

        _apply_color();
     }
    }
})(angular);