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
      'ngRoute',
      'ui.bootstrap',

      'estepApp.selector',

      'estepApp.software',
      'estepApp.endorsedby',
      // 'estepApp.softwaredatatable',

      'estepApp.projects',
      'estepApp.people',
      'estepApp.organizations',

      'estepApp.breadcrumbs'//,
      // 'estepApp.grouprowchart'
    ])
    .config(function($compileProvider) {
       // data urls are not allowed by default, so whitelist them
       $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    })
    .run(function($timeout, DataService) {
      angular.element(document).ready(function () {
        $timeout(DataService.load(), 1000);
      });
    });


  angular.module('estepApp.templates', []);

  angular.module('estepApp.utils', ['estepApp.templates', 'estepApp.d3']);
  angular.module('estepApp.ndx', ['estepApp.crossfilter','estepApp.utils']);

  angular.module('estepApp.selector', ['estepApp.utils']);
  angular.module('estepApp.endorsedby', ['estepApp.crossfilter','estepApp.utils', 'estepApp.d3', 'estepApp.dc']);
  angular.module('estepApp.software', ['estepApp.crossfilter','estepApp.utils', 'estepApp.d3', 'estepApp.dc']);
  // angular.module('estepApp.softwaredatatable', ['estepApp.utils', 'estepApp.d3', 'estepApp.dc', 'estepApp.ndx']);

  angular.module('estepApp.projects', []);
  angular.module('estepApp.people', []);
  angular.module('estepApp.organizations', []);

  // angular.module('estepApp.grouprowchart', ['estepApp.core','estepApp.utils', 'estepApp.d3', 'estepApp.dc', 'estepApp.ndx']);

  angular.module('estepApp.breadcrumbs', ['estepApp.core', 'estepApp.dc', 'estepApp.utils']);
  angular.module('estepApp.core', ['estepApp.utils', 'estepApp.d3', 'toastr', 'estepApp.ndx']);
})();
