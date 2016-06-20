(function() {
  'use strict';

  function softwareDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/software/software.directive.html',
      controller: 'SoftwareController',
      controllerAs: 'vsoftc'
    };
  }

  angular.module('estepApp.software').directive('softwareDirective', softwareDirective);
})();
