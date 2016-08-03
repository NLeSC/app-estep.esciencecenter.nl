(function() {
  'use strict';

  function NdxHelperFunctions(NdxService, d3, Messagebus, $state) {
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

    this.bagFilterHandler = function(chart, chartHeader) {
      return function(dimension, filters) {
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

        Messagebus.publish('newFilterEvent', {
          filters: filters,
          chart: chart,
          header: chartHeader
        });

        return filters;
      };
    };

    this.fulltextFilterHandler = function(chart, chartHeader) {
      return function(dimension, filters) {
        var filterString = filters[filters.length - 1];
        if (filterString) {
          var re = new RegExp(filterString, 'i');

          dimension.filterFunction(function(d) {
            var result = false;
            d.forEach(function(dim) {
             if (result !== true && dim !== undefined && dim !== null && dim.search(re) !== -1) {
               result = true;
             }
           });
           return result;
          });
        } else {
          dimension.filterAll();
        }
        if (filterString) {
          filters = [filterString];
        } else {
          filters = [];
        }
        Messagebus.publish('newFilterEvent', {
          filters: filters,
          chart: chart,
          header: chartHeader
        });
        return filters;
      };
    };

    this._appliedStates = {};
    this.applyState = function(chart, ndxInstanceName, stateFieldName, chartHeader) {
      if (ndxInstanceName === $state.$current.name &&
        stateFieldName in $state.params &&
        $state.params[stateFieldName]) {
        var query = $state.params[stateFieldName];
        if (Array.isArray(query)) {
          query.forEach(function(d) {
            chart.filter(d);
          });
        } else {
          chart.filter(query);
        }

        if (!(Array.isArray(query))) {
          query = [query];
        }
        chart.redrawGroup();

        if (!(ndxInstanceName in this._appliedStates)) {
          this._appliedStates[ndxInstanceName] = [];
        }
        // keep track of applied states so breadcrumb can be reconstructed during load of page
        this._appliedStates[ndxInstanceName].push({
          filters: query,
          chart: chart,
          header: chartHeader,
          ndxInstanceName: ndxInstanceName,
          stateFieldName: stateFieldName
        });
      }
    };
    this.appliedStates = function(ndxInstanceName, $stateParams) {
      if (ndxInstanceName in this._appliedStates) {
        // get rid of appliedStates that are not in current $stateParams
        this._appliedStates[ndxInstanceName] = this._appliedStates[ndxInstanceName].filter(function(d) {
          return ((d.stateFieldName in $stateParams) && (typeof $stateParams[d.stateFieldName] !== 'undefined'));
        });
        return this._appliedStates[ndxInstanceName];
      } else {
        return [];
      }
    };
  }

  angular.module('estepApp.utils').service('NdxHelperFunctions', NdxHelperFunctions);
})();
