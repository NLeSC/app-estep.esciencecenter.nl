// The app
/* global dc:false, d3:false, crossfilter:false, colorbrewer:false */

(function() {
  'use strict';

  angular.module('estepApp.dc', [])
    .constant('dc', dc);

  angular.module('estepApp.d3', [])
    .constant('d3', d3);

  angular.module('estepApp.crossfilter', [])
    .constant('crossfilter', crossfilter);

  angular.module('estepApp.colorbrewer', [])
    .constant('colorbrewer', colorbrewer);

  /**
   * @ngdoc over
   * @name estepApp
   * @description
   * # estepApp
   *
   * Main module of the application.
   */
  angular
    .module('estepApp', [
      'ngAnimate',
      'ngTouch',
      'ui.bootstrap',

      'estepApp.selector',

      'estepApp.software',
      'estepApp.endorsedby',
      // 'estepApp.softwaredatatable',

      'estepApp.projects',
      'estepApp.people',
      'estepApp.organizations',
      'estepApp.report',

      'estepApp.breadcrumbs' //,
      // 'estepApp.grouprowchart'
    ])
    .config(function($compileProvider, $urlRouterProvider, $locationProvider) {
      // data urls are not allowed by default, so whitelist them
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);

      $locationProvider.html5Mode(true);

      $urlRouterProvider.otherwise('/software');
    })
    .run(function($timeout, DataService) {
      angular.element(document).ready(function() {
        DataService.load();
      });
    });


  angular.module('estepApp.templates', []);

  angular.module('estepApp.utils', ['estepApp.templates', 'estepApp.d3', 'ui.router']);
  angular.module('estepApp.ndx', ['estepApp.crossfilter', 'estepApp.utils']);

  angular.module('estepApp.selector', ['estepApp.utils']);
  angular.module('estepApp.charts', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.d3', 'estepApp.dc']);

  angular
    .module('estepApp.endorsedby', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.d3', 'estepApp.dc']);

  angular
    .module('estepApp.software', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.charts'])
    .config(function($stateProvider) {
      $stateProvider.state('software-detail', {
        url: '/software/:slug?endorser',
        template: '<software-detail></software-detail>',
        params: {
          endorser: {
            value: 'All',
            squash: true
          }
        }
      });
      $stateProvider.state('software', {
        url: '/software?keywords&discipline&competence&expertise&technologyTag&supportLevel&status&programmingLanguage&license&endorser',
        template: '<software-directive></software-directive>',
        params: {
          keywords: {
            value: undefined,
            squash: true
          },
          discipline: {
            value: undefined,
            array: true,
            squash: true
          },
          competence: {
            value: undefined,
            array: true,
            squash: true
          },
          expertise: {
            value: undefined,
            array: true,
            squash: true
          },
          technologyTag: {
            value: undefined,
            array: true,
            squash: true
          },
          supportLevel: {
            value: undefined,
            squash: true
          },
          status: {
            value: undefined,
            squash: true
          },
          programmingLanguage: {
            value: undefined,
            array: true,
            squash: true
          },
          license: {
            value: undefined,
            array: true,
            squash: true
          },
          endorser: {
            value: 'All',
            squash: true
          }
        }
      });
    });

  angular
    .module('estepApp.projects', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.charts'])
    .config(function($stateProvider) {
      $stateProvider.state('project-detail', {
        url: '/project/:slug?endorser',
        template: '<project-detail></project-detail>',
        params: {
          endorser: {
            value: 'All',
            squash: true
          }
        }
      });
      $stateProvider.state('projects', {
        url: '/project?keywords&discipline&competence&expertise&dataFormat&dataMagnitude&endorser',
        template: '<projects-directive></projects-directive>',
        params: {
          keywords: {
            value: undefined,
            squash: true
          },
          discipline: {
            value: undefined,
            array: true,
            squash: true
          },
          competence: {
            value: undefined,
            array: true,
            squash: true
          },
          expertise: {
            value: undefined,
            array: true,
            squash: true
          },
          dataFormat: {
            value: undefined,
            array: true,
            squash: true
          },
          dataMagnitude: {
            value: undefined,
            squash: true
          },
          endorser: {
            value: 'All',
            squash: true
          }
        }
      });
    });

  angular
    .module('estepApp.people', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.charts'])
    .config(function($stateProvider) {
      $stateProvider.state('people-detail', {
        url: '/person/:slug?endorser',
        template: '<people-detail></people-detail>',
        params: {
          endorser: {
            value: 'All',
            squash: true
          }
        }
      });
      $stateProvider.state('people', {
        url: '/person?keywords&jobTitle&endorser',
        template: '<people-directive></people-directive>',
        params: {
          keywords: {
            value: undefined,
            squash: true
          },
          jobTitle: {
            value: undefined,
            squash: true
          },
          endorser: {
            value: 'All',
            squash: true
          }
        }
      });
    });

  angular
    .module('estepApp.organizations', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.charts'])
    .config(function($stateProvider) {
      $stateProvider.state('organization-detail', {
        url: '/organization/:slug?endorser',
        template: '<organization-detail></organization-detail>',
        params: {
          endorser: {
            value: 'All',
            squash: true
          }
        }
      });
      $stateProvider.state('organizations', {
        url: '/organization?endorser',
        template: '<organizations-directive></organizations-directive>',
        params: {
          endorser: {
            value: 'All',
            squash: true
          }
        }
      });
    });

    angular
      .module('estepApp.report', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.charts'])
      .config(function($stateProvider) {
        $stateProvider.state('report-detail', {
          url: '/report/:slug?endorser',
          template: '<report-detail></report-detail>',
          params: {
            endorser: {
              value: 'All',
              squash: true
            }
          }
        });
        $stateProvider.state('report', {
          url: '/report?endorser',
          template: '<reports></reports>',
          params: {
            endorser: {
              value: 'All',
              squash: true
            }
          }
        });
      });

  // angular.module('estepApp.grouprowchart', ['estepApp.core','estepApp.utils', 'estepApp.d3', 'estepApp.dc', 'estepApp.ndx']);

  angular.module('estepApp.breadcrumbs', ['estepApp.core', 'estepApp.dc', 'estepApp.utils']);
  angular.module('estepApp.core', ['estepApp.utils', 'estepApp.d3', 'toastr', 'estepApp.ndx', 'ngSanitize']);
})();
