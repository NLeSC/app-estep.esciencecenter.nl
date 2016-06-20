/**
 * Constants of core module
 *
 * @namespace core
 */
(function() {
  'use strict';

  angular.module('estepApp.core')
    /**
     * @class core.pattyConf
     * @memberOf core
     */
    .constant('estepConf', {
      // DATA_JSON_URL: 'file:data/contextual.timeline04-02.json'
      // DATA_JSON_URL: 'https://raw.githubusercontent.com/NLeSC/UncertaintyVisualization/gh-pages/data/contextual.timeline04-02.json',
      // DATA_JSON_URL: 'https://raw.githubusercontent.com/NLeSC/UncertaintyVisualization/narratives/app/data/embodied_0202.json',
      DATA_JSON_URL: 'file:data/index.json'
    });
})();
