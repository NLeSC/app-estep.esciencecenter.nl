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
      'ngSanitize',
      'ngTouch',
      'ui.bootstrap',

      'estepApp.selector',

      'estepApp.software',
      'estepApp.endorsedby',
      // 'estepApp.softwaredatatable',

      'estepApp.projects',
      'estepApp.people',
      'estepApp.organizations',

      'estepApp.breadcrumbs' //,
      // 'estepApp.grouprowchart'
    ])
    .config(function($compileProvider, $urlRouterProvider, $locationProvider, $stateProvider) {
      // data urls are not allowed by default, so whitelist them
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);

      // grunt serve command does not work with html5node
      //  $locationProvider.html5Mode(true);

      $urlRouterProvider.otherwise('/software');

      $stateProvider.state('software-list', {
        url: '/software?keywords&discipline&competence&expertise&technologTag&supportLevel&status&programmingLanguage&license',
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
          }
        }
      });

      $stateProvider.state('projects-list', {
        url: '/projects?keywords&discipline&competence&expertise&dataFormat&dataMagnitude',
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
          }
        }
      });
      $stateProvider.state('people-list', {
        url: '/people?keywords&jobTitle',
        template: '<people-directive></people-directive>',
        params: {
          keywords: {
            value: undefined,
            squash: true
          },
          jobTitle: {
            value: undefined,
            squash: true
          }
        }
      });
      $stateProvider.state('organizations-list', {
        url: '/organizations',
        template: '<organizations-directive></organizations-directive>'
      });
    })
    .run(function($timeout, DataService, NdxService) {
      angular.element(document).ready(function() {
        DataService.load();
      });
    });


  angular.module('estepApp.templates', []);

  angular.module('estepApp.utils', ['estepApp.templates', 'estepApp.d3']);
  angular.module('estepApp.ndx', ['estepApp.crossfilter', 'estepApp.utils']);

  angular.module('estepApp.selector', ['estepApp.utils', 'ui.router']);
  angular.module('estepApp.charts', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.d3', 'estepApp.dc']);

  angular.module('estepApp.endorsedby', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.d3', 'estepApp.dc']);

  angular.module('estepApp.software', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.charts']);
  angular.module('estepApp.projects', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.charts']);
  angular.module('estepApp.people', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.charts']);
  angular.module('estepApp.organizations', []);

  // angular.module('estepApp.grouprowchart', ['estepApp.core','estepApp.utils', 'estepApp.d3', 'estepApp.dc', 'estepApp.ndx']);

  angular.module('estepApp.breadcrumbs', ['estepApp.core', 'estepApp.dc', 'estepApp.utils']);
  angular.module('estepApp.core', ['estepApp.utils', 'estepApp.d3', 'toastr', 'estepApp.ndx']);
})();
