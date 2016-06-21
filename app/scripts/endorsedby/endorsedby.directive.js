(function() {
  'use strict';

  function endorsedbyDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/endorsedby/endorsedby.directive.html',
      controller: 'EndorsedbyController',
      controllerAs: 'endorsedbyCtrl'
    };
  }

  angular.module('estepApp.endorsedby').directive('endorsedbyDirective', endorsedbyDirective);
})();
