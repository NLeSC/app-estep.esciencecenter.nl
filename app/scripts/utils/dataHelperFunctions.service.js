(function() {
  'use strict';

  function DataHelperFunctions(estepConf, $sce) {
    this.trustedHtml = function(field) {
      return $sce.trustAsHtml(field);
    };

    this.kindOfUrl = function(url) {
      if (url.startsWith(estepConf.ROOT_URL) || url.startsWith('/')) {
        return 'internal';
      } else if (url.includes('://')) {
        return 'external';
      }
      return false;
    };

    this.goto = function(url) {
      if (!url) {
        return;
      }
      var newRoot = '';

      // Temp workaround for hosting location of cover image
      // from https://github.com/NLeSC/software.esciencecenter.nl/blob/develop running as docker container
      // newRoot = 'http://localhost:4000';

      var path = url.replace(estepConf.ROOT_URL, newRoot);
      return path;
    };
  }

  angular.module('estepApp.utils').service('DataHelperFunctions', DataHelperFunctions);
})();
