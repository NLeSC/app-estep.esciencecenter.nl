(function() {
  'use strict';

  function PeopleController(NdxService, dc) {
    NdxService.ready.then(function() {
      dc.redrawAll('people');
    });
  }

  angular.module('estepApp.people').controller('PeopleController', PeopleController);
})();
