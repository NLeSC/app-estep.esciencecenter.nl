(function() {
  'use strict';

  function licenseDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/software/charts/license/license.directive.html',
      controller: 'LicenseController',
      controllerAs: 'licenseCtrl'
    };
  }

  angular.module('estepApp.software').directive('licenseDirective', licenseDirective);
})();
