(function() {
  'use strict';

  function DataHelperFunctions(estepConf, $sce) {
    this.trustedHtml = function(field) {
      return $sce.trustAsHtml(field);
    };

    this.kindOfUrl = function(url) {
      if (url.startsWith(estepConf.ROOT_URL)) {
        return 'internal';
      } else if (url.includes('://')) {
        return 'external';
      }
      return false;
    };

    this.goto = function(url) {
      var path = url.replace(estepConf.ROOT_URL, '');
      return path;
    };
  }

  angular.module('estepApp.utils').service('DataHelperFunctions', DataHelperFunctions);
})();
