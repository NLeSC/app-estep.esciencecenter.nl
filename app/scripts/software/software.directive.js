(function() {
  'use strict';

  function softwareDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/software/software.directive.html',
      controller: 'SoftwareController',
      controllerAs: 'vm',
      scope: {},
      bindToController: true
    };
  }

  angular.module('estepApp.software').directive('softwareDirective', softwareDirective);
})();
