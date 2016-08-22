(function() {
  'use strict';

  function organizationDetailController($stateParams, DataService, DataHelperFunctions) {
    this.collection = 'organization';
    this.store = DataService;
    this.helper = DataHelperFunctions;
    this.slug = $stateParams.slug;

    DataService.ready.then(function() {
      this.record = DataService.getRecordBySlug(this.collection, $stateParams.slug);
    }.bind(this));
  }

  angular.module('estepApp.organizations').component('organizationDetail', {
    templateUrl: 'scripts/organizations/detail/organization.detail.component.html',
    controller: organizationDetailController
  });
})();
