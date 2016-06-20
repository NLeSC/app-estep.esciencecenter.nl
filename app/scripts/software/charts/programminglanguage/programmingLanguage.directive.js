(function() {
  'use strict';

  function programmingLanguageDirective() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/software/charts/programminglanguage/programmingLanguage.directive.html',
      controller: 'ProgrammingLanguageController',
      controllerAs: 'proglangCtrl'
    };
  }

  angular.module('estepApp.software').directive('programmingLanguageDirective', programmingLanguageDirective);
})();
