/**
 * @namespace core
 */
(function() {
  'use strict';

  /**
   * @class
   * @memberOf core
   */
  function DataService($http, $q, $log, d3, estepConf, DataHelperFunctions) {
    var me = this;
    var helper = DataHelperFunctions;
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
     * @return {Promise}
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

    this.getRecordBySlug = function(ndxInstanceName, slug) {
      return this.data[ndxInstanceName].find(function(record) {
        return record.slug === slug;
      });
    };
    this.getRecordById = function(id) {
      // TODO use cache, looping through all collections like this is sub-optimal?
      var finder = function(record) {
        // @id ends with /, while urls used elsewhere don't
        return record['@id'] === id || record['@id'].replace(/\/$/, '') === id;
      };
      var hit;
      estepConf.CROSSFILTER_INSTANCES.forEach(function(collection) {
        var record = this.data[collection.value].find(finder);
        if (record) {
          hit = {
            collection: collection,
            record: record
          };
        }
      }.bind(this));
      return hit;
    };

    this.linkOfPersonOrOrganization = function(entity) {
      if (!entity) {
        return;
      }
      if (typeof entity === 'string') {
        var r = this.getRecordById(entity);
        if (r) {
          return helper.goto(entity);
        }
      } else if ('name' in entity) {
        if ('githubUrl' in entity) {
          return entity.githubUrl;
        } else if ('linkedInUrl' in entity) {
          return entity.linkedInUrl;
        } else if ('twitterUrl' in entity) {
          return entity.twitterUrl;
        } else if ('website' in entity) {
          return entity.website;
        }
      }
    };
    /**
     * Get name of entity.
     * @param  {String|Object} entity Url or entity object itself.
     * @return {String} Name
     */
    this.nameOf = function(entity) {
      if (!entity) {
        return;
      }
      if (typeof entity === 'string') {
        var r = this.getRecordById(entity);
        if (r) {
          if ('name' in r.record) {
            return r.record.name;
          } else if ('title' in r.record) {
            return r.record.title;
          }
        }
        // TODO better error when record not found
        return 'NA';
      } else if ('name' in entity) {
        return entity.name;
      }
    };
  }

  angular.module('estepApp.core').service('DataService', DataService);
})();
