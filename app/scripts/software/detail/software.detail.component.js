(function() {
  'use strict';

  function SoftwareDetailController($stateParams, DataService, DataHelperFunctions) {
    this.collection = 'software';
    this.store = DataService;
    this.helper = DataHelperFunctions;
    this.slug = $stateParams.slug;

    DataService.ready.then(function() {
      this.record = DataService.getRecordBySlug(this.collection, $stateParams.slug);
    }.bind(this));

    this.licenseMap = {
      'apache-2.0': 'Apache 2.0',
      'mit': 'MIT',
      'mpl-2.0': 'Mozilla Public License 2.0'
    };
    this.licenseLabel = function(licenseId) {
      if (licenseId in this.licenseMap) {
        return this.licenseMap[licenseId];
      }
      return licenseId;
    };
  }

  angular.module('estepApp.software').component('softwareDetail', {
    templateUrl: 'scripts/software/detail/software.detail.component.html',
    controller: SoftwareDetailController
  });
})();
