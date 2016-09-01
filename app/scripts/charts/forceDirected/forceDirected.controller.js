(function() {
  'use strict';

  function ForceDirectedController($window, $element, $attrs, $stateParams, $state, d3, dc, NdxService, NdxHelperFunctions, DataService) {
    var NODE_TYPE = {
      PERSON: 0,
      PROJECT: 1,
      SOFTWARE: 2
    };

    var LINK_TYPE = {
      ENGINEER_OF: 0,
      CONTRIBUTOR_OF: 1,
      CONTACTPERSON_OF: 2,
      USER_OF: 3,
      USED_IN: 4,
      COORDINATOR_OF: 5,
      DEPENDENT_ON: 6
    };

    var ctrl = this;
    var ndxInstanceName = ctrl.ndxInstanceName = $attrs.ndxServiceName;
    ctrl.chartHeader = $attrs.chartHeader;
    ctrl.jsonFieldToChart = $attrs.jsonFieldToChart;
    // var forceDirectedGraph = dc.forceDirectedGraph('#'+$element[0].children[0].attributes.id.value);

    //The dimension for the forceDirectedGraph.
    var dimension = NdxHelperFunctions.buildDimensionWithProperty(ndxInstanceName, ctrl.jsonFieldToChart);

    var addLink = function (links, source, target, type) {
      var key = [source, target, type];
      if (links[key] === undefined) {
        links[key] = {source:source, target:target, type: type, count: 1};
      } else {
        links[key].count += 1;
      }
    };

    var removeLink = function (links, source, target, type) {
      var key = [source, target, type];
      if (links[key] !== undefined) {
        links[key].count -= 1;

        if (links[key].count === 0) {
          delete links[key];
        }
      } else {
        throw ('The link ' + source + ' - ' + target + ' doesn\'t exist.');
      }
    };

    var addRelations = function(nodes, links, source, relation, targetType, linkType) {
      if (relation !== undefined && relation !== null) {
        relation.forEach(function(target) {
          if (nodes[target] === undefined) {
            nodes[target] = {key: target, count:1, type:targetType};
          } else {
            nodes[target].count += 1;
          }

          if (targetType === NODE_TYPE.SOFTWARE) {
            var interRelation = DataService.getRecordById(target).record.usedIn;
            addRelations(nodes, links, target, interRelation, NODE_TYPE.PROJECT, LINK_TYPE.USED_IN);

            // interRelation = DataService.getRecordById(target).record.dependency;
            // addRelations(nodes, links, target, interRelation, NODE_TYPE.SOFTWARE, LINK_TYPE.DEPENDENT_ON);
          }

          //And add a link between this person and that project
          addLink(links, source, target, linkType);
        });
      }
    };

    var removeRelations = function(nodes, links, source, relation, targetType, linkType) {
      if (relation !== undefined && relation !== null) {
        relation.forEach(function(target) {
          if (nodes[target] === undefined) {
            throw ('error: tried to reduce-remove a relation ' + source + ' - ' + target + ' that didn\`t exist');
          } else {
            if (targetType === NODE_TYPE.SOFTWARE) {
              var interRelation = DataService.getRecordById(target).record.usedIn;
              removeRelations(nodes, links, target, interRelation, NODE_TYPE.PROJECT, LINK_TYPE.USED_IN);

              // interRelation = DataService.getRecordById(target).record.dependency;
              // removeRelations(nodes, links, target, interRelation, NODE_TYPE.SOFTWARE, LINK_TYPE.DEPENDENT_ON);
            }

            nodes[target].count -= 1;

            if (nodes[target].count === 0) {
              delete nodes[target];
            }
          }

          //And remove the link between this person and that project
          removeLink(links, source, target, linkType);
        });
      }
    };

    var group = dimension.groupAll().reduce(
      //Add something to our temporary collection
      function(p, v) {
        // Push the name of the person
        if (p.nodes[v.name] === undefined) {
          p.nodes[v.name] = {key: v.name, count:1, type:NODE_TYPE.PERSON, image:v.photo, slug:v.slug};
        } else {
          p.nodes[v.name].count += 1;
        }

        addRelations(p.nodes, p.links, v.name, v.engineerOf, NODE_TYPE.PROJECT, LINK_TYPE.ENGINEER_OF);
        addRelations(p.nodes, p.links, v.name, v.contributorOf, NODE_TYPE.SOFTWARE, LINK_TYPE.CONTRIBUTOR_OF);
        // addRelations(p.nodes, p.links, v.name, v.contactpersonOf, NODE_TYPE.SOFTWARE, LINK_TYPE.CONTACTPERSON_OF);
        addRelations(p.nodes, p.links, v.name, v.userOf, NODE_TYPE.SOFTWARE, LINK_TYPE.USER_OF);

        return p;
      },

      //Remove something from our temporary collection, (basically do
      //everything in the add step, but then in reverse).
      function(p, v) {
        // Pop the name of the person
        if (p.nodes[v.name] === undefined) {
          console.log('error: tried to reduce-remove a node that didnt exist');
        } else {
          removeRelations(p.nodes, p.links, v.name, v.engineerOf, NODE_TYPE.PROJECT, LINK_TYPE.ENGINEER_OF);
          removeRelations(p.nodes, p.links, v.name, v.contributorOf, NODE_TYPE.SOFTWARE, LINK_TYPE.CONTRIBUTOR_OF);
          // removeRelations(p.nodes, p.links, v.name, v.contactpersonOf, NODE_TYPE.SOFTWARE, LINK_TYPE.CONTACTPERSON_OF);
          removeRelations(p.nodes, p.links, v.name, v.userOf, NODE_TYPE.SOFTWARE, LINK_TYPE.USER_OF);

          p.nodes[v.name].count -= 1;
          if (p.nodes[v.name].count === 0) {
            delete p.nodes[v.name];
          }
        }

        return p;
      },
      //Set up the inital data structure.
      function() {
        return {
          nodes: {},
          links: {}
        };
      }
    ).value();

    NdxHelperFunctions.addAllTopOrderFunctions(group);

    var forceDirectedGraph = dc.forceDirectedGraph('#forceDirectedGraph', this.ndxInstanceName);

    var colorscale = d3.scale.ordinal()
                      .domain([NODE_TYPE.PERSON, NODE_TYPE.PROJECT, NODE_TYPE.SOFTWARE])
                      .range(['#00FF00','#FF0000','#0000FF']);

    var linkColorscale = d3.scale.ordinal()
                      .domain([ LINK_TYPE.ENGINEER_OF,
                                LINK_TYPE.CONTRIBUTOR_OF,
                                LINK_TYPE.CONTACTPERSON_OF,
                                LINK_TYPE.USER_OF,
                                4
                              ])
                      .range(['#0000FF','#FF0000','#00FF00', '#000000', '#999999']);

    var graphWidth = parseInt($element[0].clientWidth, 10); //$window.innerWidth * (8/12);
    var graphHeight = 600;

    //Set up the
    forceDirectedGraph
      //Sizes in pixels
      .width(graphWidth)
      .height(graphHeight)
      .margins({
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      })

      .forceLayout(d3.layout.force()
        .gravity(0.05)
        .distance(75)
        .charge(-75))

      //Bind data
      .dimension(dimension)
      .group(group)
      .x(d3.scale.linear().domain([0, graphWidth]))
      .y(d3.scale.linear().domain([0, graphHeight]))

      .nodeRadiusScale(d3.scale.linear().domain([0, 10]))
      // .elasticR(true)
      .radiusValueAccessor(function(d) {
        if (d.type === NODE_TYPE.PERSON && d.value > 0) {
          return 1;
        } else {
          return Math.sqrt(d.value);
        }
      })
      .colors(colorscale)
      .colorAccessor(function(d) {
        return d.type;
      })
      .linkColors(linkColorscale)
      .elasticWidth(true)
      .linkColorAccessor(function(d) {
        return 4;
        // if (d.types.length === 1) {
        //   return d.types[0];
        // } else {
        // return 4;
        // }
      })
      .renderImages(false)
      .imageAccessor(function(d) {
        return d.image;
      })

      .renderLabel(false)

      .minRadius(6)
      .maxNodeRelativeSize(0.025)

      .linkWidthScale(d3.scale.linear().domain([0, 10]))
      // .elasticW(true)
      .linkValueAccessor(function(d) {
        // if (d.value > 0) {
        //   return 3;
        // }
        return Math.sqrt(d.value);
      });

    dc.override(forceDirectedGraph, 'onClick', function(d) {
      var detailPage = 'people-detail';
      var slug = d.slug;
      if (d.type === NODE_TYPE.PERSON) {
        detailPage = 'people-detail';
      } else if (d.type === NODE_TYPE.PROJECT) {
        detailPage = 'project-detail';
        slug = DataService.getRecordById(d.key).record.slug;
      } else if (d.type === NODE_TYPE.SOFTWARE) {
        detailPage = 'software-detail';
        slug = DataService.getRecordById(d.key).record.slug;
      }
      $state.go(detailPage, {slug: slug, endorser: $state.params.endorser});

    });

    forceDirectedGraph.on('preRedraw', function(chart) {
      var maxElems = 100;
      var newChartElements = Math.max(1, Math.min(chart.group().top(Infinity).length, maxElems));

      chart.data(function(d) {
        return d.top(newChartElements);
      });
    });

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

  angular.module('estepApp.charts').controller('ForceDirectedController', ForceDirectedController);
})();
