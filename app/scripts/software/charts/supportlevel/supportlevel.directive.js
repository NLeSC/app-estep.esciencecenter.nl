(function() {
  'use strict';

  function supportLevelDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/software/charts/supportlevel/supportLevel.directive.html',
      controller: 'SupportLevelController',
      controllerAs: 'supportLevelCtrl'
    };
  }

  angular.module('estepApp.software').directive('supportLevelDirective', supportLevelDirective);
})();
