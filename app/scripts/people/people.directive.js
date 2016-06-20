(function() {
  'use strict';

  function peopleDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/people/people.directive.html',
      controller: 'peopleController',
      controllerAs: 'vpplc'
    };
  }

  angular.module('estepApp.people').directive('peopleDirective', peopleDirective);
})();
