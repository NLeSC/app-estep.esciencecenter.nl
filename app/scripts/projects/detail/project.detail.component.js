(function() {
  'use strict';

  function projectDetailController($stateParams, DataService, DataHelperFunctions) {
    this.collection = 'project';
    this.store = DataService;
    this.helper = DataHelperFunctions;
    this.slug = $stateParams.slug;

    DataService.ready.then(function() {
      this.record = DataService.getRecordBySlug(this.collection, $stateParams.slug);
    }.bind(this));

    this.bibliographyOf = function(doi) {
      var publication = DataService.getRecordById(doi);
      if (!publication) {
        return doi;
      }
      return publication.record.bibliography;
    };
  }

  angular.module('estepApp.projects').component('projectDetail', {
    templateUrl: 'scripts/projects/detail/project.detail.component.html',
    controller: projectDetailController
  });
})();
