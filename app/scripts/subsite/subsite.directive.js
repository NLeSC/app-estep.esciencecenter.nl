(function() {
  'use strict';

  function subsiteDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/subsite/subsite.directive.html',
      controller: 'SubsiteController',
      controllerAs: '$ctrl',
      scope: {},
      bindToController: true
    };
  }

  angular.module('estepApp.subsite').directive('subsiteDirective', subsiteDirective);
})();
