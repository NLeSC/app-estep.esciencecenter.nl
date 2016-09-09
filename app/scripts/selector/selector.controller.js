(function() {
  'use strict';

  function SelectorController($state, dc) {
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
      var subsiteCollections = new Set();
      subsiteCollections.add('software');
      subsiteCollections.add('projects');
      subsiteCollections.add('people');
      if (subsiteCollections.has(collection)) {
        params.subsite = $state.params.subsite;
      }
      // Between software and projects retain these filters
      if (collection === 'software' || collection === 'projects') {
        params.discipline = $state.params.discipline;
        params.competence = $state.params.competence;
        params.expertise = $state.params.expertise;
      }

      // clear all filters on destination page, so $state.go can apply filter from scratch
      dc.filterAll(collection);

      $state.go(collection, params);
    };

    this.is = function(state) {
      return $state.$current.name === state;
    };
  }

  angular.module('estepApp.selector').controller('SelectorController', SelectorController);
})();
