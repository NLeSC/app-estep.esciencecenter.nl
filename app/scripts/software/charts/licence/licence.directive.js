(function() {
  'use strict';

  function licenceDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/software/charts/licence/licence.directive.html',
      controller: 'LicenceController',
      controllerAs: 'licenceCtrl'
    };
  }

  angular.module('estepApp.software').directive('licenceDirective', licenceDirective);
})();
