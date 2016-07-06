(function() {
  'use strict';

  function NdxService(DataService, $q, dc, crossfilter, Messagebus, estepConf) {
    this.ndxInstances = {};
    this.dimensions = [];

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
      //Crossfilter initialization
      estepConf.CROSSFILTER_INSTANCES.forEach(function(instance) {
        // this.ndxInstances[instance.key] = crossfilter(data[instance.value]);
        this.ndxInstances[instance.key] = crossfilter([]);
      }.bind(this));

      deferred.resolve();
    }.bind(this);

    this.addData = function() {
      estepConf.CROSSFILTER_INSTANCES.forEach(function(instance) {
        this.ndxInstances[instance.key].add(this.data[instance.value]);
      }.bind(this));

      dc.renderAll();
    }.bind(this);

    this.resetData = function() {
      this.dimensions.forEach(function(d) {
        d.value.filter(null);
        d.value.dispose();
      });
      this.ndxInstances.forEach(function(ndx) {
        ndx.remove();
      });

      Messagebus.publish('clearFilters');
    };

    this.buildDimension = function(ndxInstanceName, dimensionName, keyAccessor) {
      var ndxInstance = this.getNdxInstance(ndxInstanceName);
      var newDimension = this.getDimension(ndxInstanceName, dimensionName);
      if (newDimension !== null) {
        console.error('Attempted to create dimension' + dimensionName + ' in ' + ndxInstanceName + ' while it already existed.');
      } else {

        newDimension = ndxInstance.dimension(keyAccessor);
        this.dimensions.push({
          key:ndxInstanceName + ':' + dimensionName,
          value:keyAccessor
        });
      }

      return newDimension;
    };

    this.getNdxInstance = function(ndxInstanceName) {
      if (!this.ndxInstances.hasOwnProperty(ndxInstanceName)) {
        console.error('The crossfilter instance ' + ndxInstanceName + ' does not exist.');
        return null;
      } else {
        return this.ndxInstances[ndxInstanceName];
      }
    };

    this.getDimension = function(ndxInstanceName, dimensionName) {
      var name = ndxInstanceName + ':' + dimensionName;
      if (!this.dimensions.hasOwnProperty(name)) {
        return null;
      } else {
        return this.dimensions[name];
      }
    };

    DataService.ready.then(function(newData) {
      this.readData(newData);
    }.bind(this));
  }

  angular.module('estepApp.ndx').service('NdxService', NdxService);
})();
