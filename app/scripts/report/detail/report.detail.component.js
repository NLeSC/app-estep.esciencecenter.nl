(function() {
  'use strict';

  function reportDetailController($stateParams, DataService, DataHelperFunctions, $filter) {
    this.collection = 'report';
    this.store = DataService;
    this.helper = DataHelperFunctions;
    this.slug = $stateParams.slug;

    DataService.ready.then(function() {
      this.record = DataService.getRecordBySlug(this.collection, $stateParams.slug);
    }.bind(this));

    this.formattedDate = function() {
      if (!this.record) {
        return '';
      }
      return $filter('date')(new Date(this.record.date), 'MMMM yyyy')
    };
  }

  angular.module('estepApp.report').component('reportDetail', {
    templateUrl: 'scripts/report/detail/report.detail.component.html',
    controller: reportDetailController
  });
})();
