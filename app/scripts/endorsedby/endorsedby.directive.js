(function() {
  'use strict';

  function endorsedbyDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/endorsedby/endorsedby.directive.html',
      controller: 'EndorsedbyController',
      controllerAs: '$ctrl',
      scope: {},
      bindToController: true
    };
  }

  angular.module('estepApp.endorsedby').directive('endorsedbyDirective', endorsedbyDirective);
})();
