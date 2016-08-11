/**
 * @namespace core
 */
(function() {
  'use strict';

  /**
   * @class
   * @memberOf core
   */
  function DataService($http, $q, $log, d3, estepConf) {
    var me = this;
    this.data = {};
    var deferred = $q.defer();

    /**
     * Promise for loading the sites remotely.
     * Can be used to perform action when loading sites has been completed.
     *
     * @type {Promise}
     */
    this.ready = deferred.promise;

    /**
     * Load data from server
     *
     * @returns {Promise}
     */
    this.load = function() {
      var url = estepConf.DATA_JSON_URL;
      d3.json(url, function(error, json) {
        if (error) {
          return console.warn(error);
        }
        me.data = json;
        deferred.resolve(me.data);
        //Messagebus.publish('data loaded', this.getData);
        // Messagebus.publish('new data loaded', this.getData);
      }.bind(this));
    }.bind(this);
  }

  angular.module('estepApp.core').service('DataService', DataService);
})();
