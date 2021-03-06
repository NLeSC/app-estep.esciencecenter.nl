/**
 * Constants of core module
 *
 * @namespace core
 */
(function() {
  'use strict';

  angular.module('estepApp.core')
    /**
     * @class core.estepConf
     * @memberOf core
     */
    .constant('estepConf', {
      // DATA_JSON_URL: 'file:data/contextual.timeline04-02.json'
      // DATA_JSON_URL: 'https://raw.githubusercontent.com/NLeSC/UncertaintyVisualization/gh-pages/data/contextual.timeline04-02.json',
      // DATA_JSON_URL: 'https://raw.githubusercontent.com/NLeSC/UncertaintyVisualization/narratives/app/data/embodied_0202.json',
      DATA_JSON_URL: '/index.json',
      // mapping where
      // key is name of dc group and crossfilter instance.
      // value is key from index.json object
      CROSSFILTER_INSTANCES: [
        {key: 'software', value: 'software'},
        {key: 'projects', value: 'project'},
        {key: 'people', value: 'person'},
        {key: 'organizations', value: 'organization'},
        {key: 'report', value: 'report'},
        {key: 'publication', value: 'publication'},
      ],
      SUBSITE_WHITELIST: [
        '/organization/nlesc',
        // '/organization/meertens',
        // '/organization/tno',
        // '/organization/knmi',
        // '/organization/cwi',
        // '/organization/nikhef',
        // '/organization/huygens',
        // '/organization/deltares',
        // '/organization/astron'
      ],
      ROWCHART_DIMENSIONS: {
        width: 250,
        barHeight: 25,
        gapHeight: 1,
        margins: {top: 0, bottom: -1, right: 0, left: 0}
      },
      ROOT_URL: 'http://software.esciencecenter.nl'
    });
})();
