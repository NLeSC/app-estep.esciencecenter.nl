(function() {
  'use strict';

  function peopleDetailController($stateParams, DataService, DataHelperFunctions) {
    this.collection = 'person';
    this.store = DataService;
    this.helper = DataHelperFunctions;
    this.slug = $stateParams.slug;

    DataService.ready.then(function() {
      this.record = DataService.getRecordBySlug(this.collection, $stateParams.slug);
    }.bind(this));
  }

  angular.module('estepApp.people').component('peopleDetail', {
    templateUrl: 'scripts/people/detail/people.detail.component.html',
    controller: peopleDetailController
  });
})();
