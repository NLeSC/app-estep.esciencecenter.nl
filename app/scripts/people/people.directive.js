(function() {
  'use strict';

  function peopleDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/people/people.directive.html',
      controller: 'PeopleController',
      controllerAs: 'vm',
      scope: {},
      bindToController: true
    };
  }

  angular.module('estepApp.people').directive('peopleDirective', peopleDirective);
})();
