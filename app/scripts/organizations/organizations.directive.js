(function() {
  'use strict';

  function organizationsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/organizations/organizations.directive.html',
      controller: 'organizationsController',
      controllerAs: 'vorgc'
    };
  }

  angular.module('estepApp.organizations').directive('organizationsDirective', organizationsDirective);
})();
