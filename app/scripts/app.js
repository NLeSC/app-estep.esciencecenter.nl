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
    .config(function($compileProvider, $urlRouterProvider) {
      // data urls are not allowed by default, so whitelist them
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);

      // grunt serve command does not work with html5node
      //  $locationProvider.html5Mode(true);

      $urlRouterProvider.otherwise('/endorse/All/software');
    })
    .run(function($timeout, DataService, NdxService) {
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
    .module('estepApp.endorsedby', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.d3', 'estepApp.dc'])
    .config(function ($stateProvider) {
      $stateProvider.state('endorsement', {
        url: '/endorse/:endorser',
        template: '<rig-selector></rig-selector>',
      });
    });

  angular
    .module('estepApp.software', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.charts'])
    .config(function($stateProvider) {
      $stateProvider.state('software', {
        url: '/software?keywords&discipline&competence&expertise&technologTag&supportLevel&status&programmingLanguage&license',
        template: '<software-directive></software-directive>',
        parent: 'endorsement',
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
    });
  angular
    .module('estepApp.projects', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.charts'])
    .config(function($stateProvider) {
      $stateProvider.state('projects', {
        url: '/projects?keywords&discipline&competence&expertise&dataFormat&dataMagnitude',
        template: '<projects-directive></projects-directive>',
        parent: 'endorsement',
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
    });
  angular
    .module('estepApp.people', ['estepApp.crossfilter', 'estepApp.utils', 'estepApp.charts'])
    .config(function($stateProvider) {
      $stateProvider.state('people', {
        url: '/people?keywords&jobTitle',
        template: '<people-directive></people-directive>',
        parent: 'endorsement',
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
    });
  angular
    .module('estepApp.organizations', [])
    .config(function($stateProvider) {
      $stateProvider.state('organizations', {
        url: '/organizations',
        template: '<organizations-directive></organizations-directive>',
        parent: 'endorsement'
      });
    });

  // angular.module('estepApp.grouprowchart', ['estepApp.core','estepApp.utils', 'estepApp.d3', 'estepApp.dc', 'estepApp.ndx']);

  angular.module('estepApp.breadcrumbs', ['estepApp.core', 'estepApp.dc', 'estepApp.utils']);
  angular.module('estepApp.core', ['estepApp.utils', 'estepApp.d3', 'toastr', 'estepApp.ndx']);
})();
