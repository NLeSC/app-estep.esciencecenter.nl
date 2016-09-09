(function() {
  'use strict';

  function GenericForceDirectedController($window, $element, $attrs, $stateParams, $state, d3, dc, NdxService, NdxHelperFunctions, DataService) {
    var ctrl = this;
    var ndxInstanceName = ctrl.ndxInstanceName = $attrs.ndxServiceName;
    ctrl.chartHeader = $attrs.chartHeader;
    ctrl.jsonFieldToChart = $attrs.jsonFieldToChart;
    ctrl.nodeType = $attrs.nodeType;
    ctrl.jsonFieldsToRelate = $attrs.jsonFieldsToRelate.split(',').map(function(a){return a.trim();});
    ctrl.typesOfRelations = $attrs.typesOfRelations.split(',').map(function(a){return a.trim();});
    ctrl.relationTypes = $attrs.relationTypes.split(',').map(function(a){return a.trim();});
    ctrl.prefilteredOn = $attrs.prefilteredOn;
    // var forceDirectedGraph = dc.forceDirectedGraph('#'+$element[0].children[0].attributes.id.value);

    //The dimension for the forceDirectedGraph.
    var dimension = NdxHelperFunctions.buildDimensionWithProperty(ndxInstanceName, ctrl.jsonFieldToChart);

    var addLink = function (links, source, target, type) {
      var sourceID, targetID;
      if (typeof source === 'string') {
        sourceID = source.replace(/\/$/, '');
      } else {
        sourceID = source.name;
      }
      if (typeof target === 'string') {
        targetID = target.replace(/\/$/, '');
      } else {
        targetID = target.name;
      }

      var key = [sourceID, targetID, type];
      if (links[key] === undefined) {
        links[key] = {source:sourceID, target:targetID, type: type, count: 1};
      } else {
        links[key].count += 1;
      }
    };

    var removeLink = function (links, source, target, type) {
      var sourceID, targetID;
      if (typeof source === 'string') {
        sourceID = source.replace(/\/$/, '');
      } else {
        sourceID = source.name;
      }
      if (typeof target === 'string') {
        targetID = target.replace(/\/$/, '');
      } else {
        targetID = target.name;
      }

      var key = [sourceID, targetID, type];
      if (links[key] !== undefined) {
        links[key].count -= 1;

        if (links[key].count === 0) {
          delete links[key];
        }
      } else {
        throw ('The link ' + sourceID + ' - ' + targetID + ' doesn\'t exist.');
      }
    };

    var addToNodes = function(nodes, id, type) {
      var name, newID;
      if (typeof id === 'string') {
        newID = id.replace(/\/$/, '');
        var record = DataService.getRecordById(id);
        if (record !== undefined) {
          name = record.record.name;
        } else {
          name = newID;
        }
      } else {
        newID = id.name;
        name = id.name;
      }

      if (nodes[newID] === undefined) {
        nodes[newID] = {key: newID, label: name, count:1, type:type};
      } else {
        nodes[newID].count += 1;
      }
    };

    var removeFromNodes = function(nodes, id, type) {
      var newID;
      if (typeof id === 'string') {
        newID = id.replace(/\/$/, '');
      } else {
        newID = id.name;
      }

      if (nodes[newID] === undefined) {
        throw ('error: tried to reduce-remove a node ' + newID + ' that didn\`t exist');
      } else {
        nodes[newID].count -= 1;

        if (nodes[newID].count === 0) {
          delete nodes[newID];
        }
      }
    };

    var addRelations = function(nodes, links, source, relation, targetType, linkType) {
      if (relation !== undefined && relation !== null) {
        if (Array.isArray(relation)) {
          relation.forEach(function(target) {
            addToNodes(nodes, target, targetType);
            addLink(links, source, target, linkType);

            // if (targetType === NODE_TYPE.SOFTWARE) {
            //   var interRelation = DataService.getRecordById(target).record.dependency;
            //   addRelations(nodes, links, target, interRelation, NODE_TYPE.SOFTWARE, LINK_TYPE.DEPENDENT_ON);
            // }
          });
        } else {
          var target = relation;
          addToNodes(nodes, target, targetType);
          addLink(links, source, target, linkType);
        }
      }
    };

    var removeRelations = function(nodes, links, source, relation, targetType, linkType) {
      if (relation !== undefined && relation !== null) {
        if (Array.isArray(relation)) {
          relation.forEach(function(target) {
            // if (targetType === NODE_TYPE.SOFTWARE) {
            //   var interRelation = DataService.getRecordById(target).record.dependency;
            //   removeRelations(nodes, links, target, interRelation, NODE_TYPE.SOFTWARE, LINK_TYPE.DEPENDENT_ON);
            // }

            removeLink(links, source, target, linkType);
            removeFromNodes(nodes, target, targetType);
          });
        } else {
          var target = relation;
          removeLink(links, source, target, linkType);
          removeFromNodes(nodes, target, targetType);
        }
      }
    };

    var group = dimension.groupAll().reduce(
      //Add something to our temporary collection
      function(p, v) {
        var id = v['@id'].replace(/\/$/, '');

        addToNodes(p.nodes, id, ctrl.nodeType);

        ctrl.jsonFieldsToRelate.forEach(function(relation, i) {
          var typeOfRelation = ctrl.typesOfRelations[i];
          var relationType = ctrl.relationTypes[i];
          addRelations(p.nodes, p.links, id, v[relation], typeOfRelation, relationType);
        });

        // addRelations(p.nodes, p.links, id, v.dependency,    NODE_TYPE.SOFTWARE, LINK_TYPE.DEPENDENT_ON);
        // addRelations(p.nodes, p.links, id, v.contactPerson, NODE_TYPE.PERSON,   LINK_TYPE.CONTACTPERSON_OF);
        // addRelations(p.nodes, p.links, id, v.contributor,   NODE_TYPE.PERSON,   LINK_TYPE.CONTRIBUTOR_OF);
        // addRelations(p.nodes, p.links, id, v.usedIn,        NODE_TYPE.PROJECT,  LINK_TYPE.USED_IN);

        return p;
      },

      //Remove something from our temporary collection, (basically do
      //everything in the add step, but then in reverse).
      function(p, v) {
        var id = v['@id'].replace(/\/$/, '');

        if (p.nodes[id] === undefined) {
          throw ('error: tried to reduce-remove a node ' + id + ' that didn\`t exist');
        } else {
          ctrl.jsonFieldsToRelate.forEach(function(relation, i) {
            var typeOfRelation = ctrl.typesOfRelations[i];
            var relationType = ctrl.relationTypes[i];
            removeRelations(p.nodes, p.links, id, v[relation], typeOfRelation, relationType);
          });

          // removeRelations(p.nodes, p.links, id, v.dependency,    NODE_TYPE.SOFTWARE, LINK_TYPE.DEPENDENT_ON);
          // removeRelations(p.nodes, p.links, id, v.contactPerson, NODE_TYPE.PERSON,   LINK_TYPE.CONTACTPERSON_OF);
          // removeRelations(p.nodes, p.links, id, v.contributor,   NODE_TYPE.PERSON,   LINK_TYPE.CONTRIBUTOR_OF);
          // removeRelations(p.nodes, p.links, id, v.usedIn,        NODE_TYPE.PROJECT,  LINK_TYPE.USED_IN);

          removeFromNodes(p.nodes, id, ctrl.nodeType);
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

    // if (ctrl.prefilteredOn) {
    //   dimension.filter(ctrl.prefilteredOn);
    // }

    var forceDirectedGraph = dc.forceDirectedGraph($element[0].children[0], ndxInstanceName);

    var colorscale = d3.scale.ordinal()
                      .domain([0, 1, 2])
                      .range(['#fee0d2','#e5f5e0','#9ecae1']);

    var linkColorscale = d3.scale.ordinal()
                      .domain([ 0 ])
                      .range(['#999999']);

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
        .charge(-75)
        // .linkStrength(0.1)
        .friction(0.5)
        .theta(0.8)
        .alpha(0.1))

      //Bind data
      .dimension(dimension)
      .group(group)
      .x(d3.scale.linear().domain([0, graphWidth]))
      .y(d3.scale.linear().domain([0, graphHeight]))

      .nodeRadiusScale(d3.scale.linear().domain([0, 10]))
      // .elasticR(true)
      .radiusValueAccessor(function(d) {
        if (d.type === 0 && d.value > 0) {
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
        return 0;
      })
      .renderImages(false)
      .imageAccessor(function(d) {
        return d.image;
      })

      .renderLabel(true)
      .labelAccessor(function(d) {
        return d.label;
      })

      .minRadius(6)
      .maxNodeRelativeSize(0.025)

      .linkWidthScale(d3.scale.linear().domain([0, 10]))
      // .elasticW(true)
      .linkValueAccessor(function(d) {
        if (d.value > 0) {
          return 3;
        }
        // return Math.sqrt(d.value);
      });

    dc.override(forceDirectedGraph, 'onClick', function(d) {
      var detailPage = 'people-detail';

      if (d.type === 0 || d.type === '0') {
        detailPage = 'people-detail';
      } else if (d.type === 1 || d.type === '1') {
        detailPage = 'project-detail';
      } else if (d.type === 2 || d.type === '2') {
        detailPage = 'software-detail';
      }

      var record = DataService.getRecordById(d.key);
      if (record !== undefined) {
        var slug = record.record.slug;
        $state.go(detailPage, {slug: slug, subsite: $state.params.subsite});
      }

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

  angular.module('estepApp.charts').controller('GenericForceDirectedController', GenericForceDirectedController);
})();
