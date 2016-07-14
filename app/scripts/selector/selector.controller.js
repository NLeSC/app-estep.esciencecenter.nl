(function() {
  'use strict';

  function SelectorController($state) {
    // this.collectionState = {};

    this.filter = function(collection) {
      var params = {};

      // if ($state.$current.name !== collection) {
      //   // remember params of of old tab
      //   this.collectionState = $state.params;
      // }
      // if (collection in this.collectionState) {
      //   // restore old filter
      //   params = this.collectionState[collection];
      // }

      // apply filters from source page to destination page
      var endorserCollections = new Set();
      endorserCollections.add('software');
      endorserCollections.add('projects');
      endorserCollections.add('people');
      if (endorserCollections.has(collection)) {
        params.endorser = $state.params.endorser;
      }
      if (collection === 'software' || collection === 'projects') {
        params.discipline = $state.params.discipline;
        params.competence = $state.params.competence;
        params.expertise = $state.params.expertise;
      }
      $state.go(collection, params);
    };

    this.is = function(collection) {
      return $state.$current.name === collection;
    };
  }

  angular.module('estepApp.selector').controller('SelectorController', SelectorController);
})();
