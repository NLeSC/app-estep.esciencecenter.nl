(function() {
  'use strict';

  function NdxHelperFunctions(NdxService, d3, Messagebus) {
    //Helper function to get unique elements of an array
    var arrayUnique = function(a) {
      return a.reduce(function(p, c) {
        if (p.indexOf(c) < 0) {
          p.push(c);
        }
        return p;
      }, []);
    };

    this.determineUniqueInhabitants = function(data, subKey) {
      var concatenatedInhabitants = [];

      var results = data[subKey];
      if (results !== undefined && results !== null && results[subKey] !== null) {
        results.forEach(function(inhabitant) {
          concatenatedInhabitants.push(inhabitant);
        });
      } else {
        concatenatedInhabitants.push('none');
      }

      var uniqueInhabitants = arrayUnique(concatenatedInhabitants);
      return uniqueInhabitants;
    };

    this.customReduceAdd = function(subKey) {
      return function(p, v) {
        var results = v[subKey];
        if (results !== undefined && results !== null && results[subKey] !== null) {
          results.forEach(function(inhabitant) {
            p[inhabitant] = (p[inhabitant] || 0) + 1;
          });
        } else {
          p.none = (p.none || 0) + 1;
        }

        return p;
      };
    };

    this.customReduceRemove = function(subKey) {
      return function(p, v) {
        var results = v[subKey];
        if (results !== undefined && results !== null && results[subKey] !== null) {
          results.forEach(function(inhabitant) {
            p[inhabitant] = (p[inhabitant] || 0) - 1;
          });
        } else {
          p.none = (p.none || 0) - 1;
        }

        return p;
      };
    };

    this.customReduceInitial = function(subKey) {
      return function() {
        return {};
      };
    };

    this.addAllTopOrderFunctions = function(group) {
      group.all = function() {
        var newObject = [];
        for (var key in this) {
          if (this.hasOwnProperty(key) && key !== 'all' && key !== 'top' && key !== 'order') {
            newObject.push({
              key: key,
              value: this[key]
            });
          }
        }
        return newObject;
      };
      group.top = function(n) {
        var newObject = this.all().sort(function(a, b) {
          return b.value - a.value;
        }).slice(0, n);

        return newObject;
      };
      group.order = function(p) {
        return p;
      };
    };

    this.buildDimensionWithArrayProperty = function(ndxInstanceName, dimensionName) {
      var newDimension = null;

      newDimension = NdxService.buildDimension(ndxInstanceName, dimensionName, function(d) {
        return this.determineUniqueInhabitants(d, dimensionName);
      }.bind(this));

      return newDimension;
    }.bind(this);

    this.buildGroupWithArrayProperty = function(dimension, subKey) {
      var newGroup = dimension.groupAll()
        .reduce(
          this.customReduceAdd(subKey),
          this.customReduceRemove(subKey),
          this.customReduceInitial(subKey)
        ).value();

      this.addAllTopOrderFunctions(newGroup);

      return newGroup;
    }.bind(this);

    this.buildDimensionWithProperty = function(ndxInstanceName, dimensionName) {
      var newDimension = NdxService.buildDimension(ndxInstanceName, dimensionName, function(d) {
        return d[dimensionName];
      }.bind(this));

      return newDimension;
    }.bind(this);

    this.buildGroupWithProperty = function(dimension) {
      var newGroup = dimension.group();

      return newGroup;
    }.bind(this);

    this.buildDimensionWithProperties = function(ndxInstanceName, dimensionName, keys) {      
      var newDimension = NdxService.buildDimension(ndxInstanceName, dimensionName, function(d) {
        var result = [];
        keys.forEach(function(key) {
          result.push(d[key]);
        });
        return result;
      }.bind(this));

      return newDimension;
    }.bind(this);

    this.bagFilterHandler = function() {
      return function(dimension, filters) {
        Messagebus.publish('newFilterEvent', [filters, dimension]);

        dimension.filterFunction(function(d) {
          var result = true;
          if (d === undefined) {
            result = false;
          } else if (result === true && d instanceof String) {
            filters.forEach(function(f) {
              if(d !== f) {
                result = false;
              }
            });
          } else {
            filters.forEach(function(f) {
              if (result === true && d.indexOf(f) === -1) {
                result = false;
              }
            });
          }
          return result;
        });

        return filters;
      };
    };
  }

  angular.module('estepApp.utils').service('NdxHelperFunctions', NdxHelperFunctions);
})();
