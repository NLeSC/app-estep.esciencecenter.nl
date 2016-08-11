(function() {
  'use strict';

  function ForceDirectedController($window, $element, $attrs, $stateParams, $state, d3, dc, NdxService, NdxHelperFunctions, estepConf) {
    var ctrl = this;
    var ndxInstanceName = ctrl.ndxInstanceName = $attrs.ndxServiceName;
    ctrl.chartHeader = $attrs.chartHeader;
    ctrl.jsonFieldToChart = $attrs.jsonFieldToChart;
    // var forceDirectedGraph = dc.forceDirectedGraph('#'+$element[0].children[0].attributes.id.value);

    //The dimension for the forceDirectedGraph.
    var dimension = NdxHelperFunctions.buildDimensionWithProperty(ndxInstanceName, ctrl.jsonFieldToChart);

    var group = dimension.groupAll().reduce(
      //Add something to our temporary collection
      function(p, v) {
        // Push the name of the person
        p.nodes.push(v.name);

        // Push the name of the project (if it doesn't exist yet)
        if (v.engineerOf !== undefined && v.engineerOf !== null) {
          v.engineerOf.forEach(function(project) {
            if (p.projects[project] === undefined) {
              p.projects[project] = {name: project, count:1};
            } else {
              p.projects[project].count += 1;
            }

            //And add a link between this person and that project
            p.links.push([v.name, project]);
          });
        };

        // v.contributorOf.forEach(function(project) {
        //   if (p.software.indexOf(project) == -1) {
        //     p.software.push(project);
        //   }
        // });
        // v.contactpersonOf.forEach(function(project) {
        //   if (p.software.indexOf(project) == -1) {
        //     p.software.push(project);
        //   }
        // });
        // v.userOf.forEach(function(project) {
        //   if (p.software.indexOf(project) == -1) {
        //     p.software.push(project);
        //   }
        // });

        return p;
      },

      //Remove something from our temporary collection, (basically do
      //everything in the add step, but then in reverse).
      function(p, v) {
        // Pop the name of the person
        p.nodes.pop(v.name);

        // Decrease the counter on the the project and clear it if it reaches 0
        if (v.engineerOf !== undefined && v.engineerOf !== null) {
          v.engineerOf.forEach(function(project) {
            if (p.projects[project] === undefined) {
              console.log('error: tried to reduce-remove a project that didnt exist');
            } else {
              p.projects[project].count -= 1;
              if (p.projects[project].count === 0) {
                delete p.projects[project];
              };
            }

            //And remove the link between this person and that project
            p.links.pop([v.name, project]);
          });
        };

        return p;
      },
      //Set up the inital data structure.
      function() {
        return {
          nodes: [],
          projects: {},
          links: []
        };
      }
    ).value();

    var forceDirectedGraph = dc.forceDirectedGraph('forceDirectedGraph');

    //Set up the
    forceDirectedGraph
      //Sizes in pixels
      .width($window.innerWidth - 8)
      .height(400)

      //Bind data
      .dimension(dimension)
      .group(group);

    forceDirectedGraph.render();

    NdxHelperFunctions.applyState(forceDirectedGraph, this.ndxInstanceName, this.stateFieldName);

    this.applyFilter = function() {
      var filter = this.input;
      dc.events.trigger(function () {
          forceDirectedGraph.filter(filter);
          forceDirectedGraph.redrawGroup();
      });
    };

  }


  //
  //     .filterHandler(HelperFunctions.customDefaultFilterHandler.bind(forceDirectedGraph))
  //
  //     //The time this chart takes to do its animations.
  //     .transitionDuration(1500)
  //
  //     //x Axis
  //     .x(d3.time.scale())
  //       .elasticX(true)
  //       .xAxisPadding(100)
  //       .keyAccessor(function(p) {
  //         //The time of this event
  //         return p.key[0];
  //       })
  //
  //     //y Axis
  //     .y(d3.scale.ordinal()
  //         .domain((function() {
  //           return uniqueActors;
  //         })())
  //       )
  //       .valueAccessor(function(p) {
  //         return p.key[1];
  //       })
  //
  //     //Radius of the bubble
  //     .r(d3.scale.linear())
  //       .elasticRadius(true)
  //       .radiusValueAccessor(function(p) {
  //         if (p.value.count > 0) {
  //           return p.key[1].length;
  //         } else {
  //           return 0;
  //         }
  //       })
  //       .minRadius(5)
  //       .maxBubbleRelativeSize(0.015)
  //
  //     //Labels printed just above the bubbles
  //     .renderLabel(true)
  //       .minRadiusWithLabel(0)
  //       .label(function(p) {
  //         var mostImportantLabel;
  //         var scoreOfMostImportantLabel = -1;
  //         //Get the most important label (highest climax score)
  //         var labels = Object.keys(p.value.labels);
  //         labels.forEach(function(l) {
  //           if (p.value.labels[l] > scoreOfMostImportantLabel) {
  //             mostImportantLabel = l;
  //             scoreOfMostImportantLabel = p.value.labels[l];
  //           }
  //         });
  //         return mostImportantLabel.toString(); //p.key;
  //       })
  //
  //     //Information on hover
  //     .renderTitle(true)
  //       .title(function(p) {
  //         //Get the actors
  //         var actors = p.key[1];
  //         var actorString = '';
  //         actors.forEach(function(a) {
  //           actorString= a '\n';
  //         });
  //
  //         var labelString = '';
  //         var labels = Object.keys(p.value.labels);
  //         labels.forEach(function(l) {
  //           labelString= l '\n';
  //         });
  //
  //         var titleString = '\n---Actors-------\n'
  //           actorString
  //           '\n---Labels-------\n'
  //           labelString
  //           '\n---Mentions-----\n'
  //           mentionToTxt(p.value, this.sources);
  //         return titleString;
  //       }.bind(this));
  //
  //     //A hack to make the customBubbleChart filter out 0-value bubbles while determining the x-axis range
  //     dc.override(forceDirectedGraph, 'xAxisMin', function() {
  //       var min = d3.min(forceDirectedGraph.data(), function(e) {
  //         if (forceDirectedGraph.radiusValueAccessor()(e) > 0) {
  //           return forceDirectedGraph.keyAccessor()(e);
  //         }
  //       });
  //       return dc.utils.subtract(min, forceDirectedGraph.xAxisPadding());
  //     });
  //
  //     dc.override(forceDirectedGraph, 'xAxisMax', function() {
  //       var max = d3.max(forceDirectedGraph.data(), function(e) {
  //         if (forceDirectedGraph.radiusValueAccessor()(e) > 0) {
  //           return forceDirectedGraph.keyAccessor()(e);
  //         }
  //       });
  //       return dc.utils.add(max, forceDirectedGraph.xAxisPadding());
  //     });
  //
  //     //A hack to make the bubbleChart accept ordinal values on the y Axis
  //     dc.override(forceDirectedGraph, '_prepareYAxis', function(g) {
  //       this.__prepareYAxis(g);
  //       this.y().rangeBands([this.yAxisHeight(), 0], 0, 1);
  //     });
  //
  //     dc.override(forceDirectedGraph, 'fadeDeselectedArea', function() {
  //       if (forceDirectedGraph.hasFilter()) {
  //         forceDirectedGraph.selectAll('g.' forceDirectedGraph.BUBBLE_NODE_CLASS).each(function(d) {
  //           if (forceDirectedGraph.isSelectedNode(d)) {
  //             forceDirectedGraph.highlightSelected(this);
  //           } else {
  //             forceDirectedGraph.fadeDeselected(this);
  //           }
  //         });
  //       } else {
  //         forceDirectedGraph.selectAll('g.' forceDirectedGraph.BUBBLE_NODE_CLASS).each(function() {
  //           forceDirectedGraph.resetHighlight(this);
  //         });
  //       }
  //     });
  //
  //     //Disable the onClick handler for this chart
  //     dc.override(forceDirectedGraph, 'onClick', function() {
  //     });
  //
  //
  //     rowChart.on('preRedraw', function(chart) {
  //      var newChartElements = Math.max(1, Math.min(chart.group().top(Infinity).length, maxRows));
  //
  //      var newHeight = chartheight(newChartElements);
  //      if (chart.height() !== newHeight) {
  //        chart.height(newHeight);
  //        chart.render();
  //      }
  //
  //      chart.data(function(d) {
  //        return d.top(newChartElements);
  //      });
  //     });
  //
  //     rowChart.render();
  //     NdxHelperFunctions.applyState(rowChart, ndxInstanceName, ctrl.jsonArrayFieldToChart);
  // }

  // function ForceDirectedController($element, $attrs, $stateParams, $state, d3, dc, NdxService, NdxHelperFunctions) {
  //   var ctrl = this;
  //   this.input = '';
  //   this.chartHeader = $attrs.chartHeader;
  //   this.ndxInstanceName = $attrs.ndxServiceName;
  //   this.NdxService = NdxService;
  //   this.stateFieldName = 'keywords';
  //
  //   var dimensionName = 'textSearch';
  //   var fields = $attrs.jsonFields.split(',').map(function(field) {
  //     return field.trim();
  //   });
  //   this.dimension = NdxHelperFunctions.buildDimensionWithProperties(this.ndxInstanceName, dimensionName, fields);
  //
  //   var _chart = dc.baseMixin({})
  //     .chartGroup(this.ndxInstanceName)
  //     .dimension(this.dimension)
  //     .filterHandler(function(dimension, filters) {
  //       var result = NdxHelperFunctions.fulltextFilterHandler(_chart, ctrl.stateFieldName)(dimension, filters);
  //       var params = {};
  //       params[ctrl.stateFieldName] = result[0];
  //       $state.go(ctrl.ndxInstanceName, params, {notify: false});
  //       return result;
  //     });
  //   _chart.render = function() {
  //     if (!this.filter()) {
  //       ctrl.input = '';
  //     }
  //     return _chart;
  //   };
  //   NdxHelperFunctions.applyState(_chart, this.ndxInstanceName, this.stateFieldName);
  //
  //   this.applyFilter = function() {
  //     var filter = this.input;
  //     dc.events.trigger(function () {
  //         _chart.filter(filter);
  //         _chart.redrawGroup();
  //     });
  //   };
  // }

  angular.module('estepApp.charts').controller('ForceDirectedController', ForceDirectedController);
})();
