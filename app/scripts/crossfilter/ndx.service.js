(function() {
  'use strict';

  function NdxService(DataService, $q, crossfilter, Messagebus, estepConf) {
    this.ndxInstances = {};
    this.dimensionCache = {};
    this.storedFilters = {};

    var deferred = $q.defer();

    /**
     * Promise for loading the sites remotely.
     * Can be used to perform action when loading sites has been completed.
     *
     * @type {Promise}
     */
    this.ready = deferred.promise;

    this.getSize = function(ndxInstanceName) {
      return this.ndxInstances[ndxInstanceName].size();
    };

    this.readData = function(data) {
      this.data = data;
      // Crossfilter initialization
      estepConf.CROSSFILTER_INSTANCES.forEach(function(instance) {
        if (this.ndxInstances.hasOwnProperty(instance.key)) {
          this.ndxInstances[instance.key].add(data[instance.value]);
        } else {
          this.ndxInstances[instance.key] = crossfilter(data[instance.value]);
        }
      }.bind(this));
      deferred.resolve();
    }.bind(this);

    this.resetData = function() {
      this.dimensionCache.keys().forEach(function(i) {
        var d = this[i];
        d.filter(null);
        d.dispose();
      }, this.dimensionCache);
      this.ndxInstances.keys().forEach(function(ndx) {
        this[ndx].remove();
      }, this.ndxInstances);

      Messagebus.publish('clearFilters');
    };

    this.buildDimension = function(ndxInstanceName, dimensionName, keyAccessor) {
      var ndxInstance = this.getNdxInstance(ndxInstanceName);
      var newDimension = this.getDimension(ndxInstanceName, dimensionName);
      if (newDimension === null) {
        newDimension = ndxInstance.dimension(keyAccessor);
        this.dimensionCache[ndxInstanceName + ':' + dimensionName] = newDimension;
      }

      return newDimension;
    };

    this.getNdxInstance = function(ndxInstanceName) {
      if (!this.ndxInstances.hasOwnProperty(ndxInstanceName)) {
        this.ndxInstances[ndxInstanceName] = crossfilter([]);
      }
      return this.ndxInstances[ndxInstanceName];
    };

    this.getDimension = function(ndxInstanceName, dimensionName) {
      var name = ndxInstanceName + ':' + dimensionName;
      if (this.dimensionCache.hasOwnProperty(name)) {
        return this.dimensionCache[name];
      }
      return null;
    };

    this.getRecordBySlug = function(ndxInstanceName, slug) {
      return this.data[ndxInstanceName].find(function(record) {
        return record.slug === slug;
      });
    };
    this.getRecordById = function(id) {
      // TODO use cache, looping through all collections like this is sub-optimal?
      var finder = function(record) {
        // @id ends with /, while urls used elsewhere don't
        return record['@id'].replace(/\/$/, '') === id;
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

    DataService.ready.then(function(newData) {
      this.readData(newData);
    }.bind(this));
  }

  angular.module('estepApp.ndx').service('NdxService', NdxService);
})();
