
dc.forceDirectedGraph = function (parent, chartGroup) {
    'use strict';

    var _chart = dc.graphMixin(dc.coordinateGridMixin({}));

    _chart._mandatoryAttributes(['dimension', 'group']);
    _chart.TEXT_CLASS = 'labels';
    _chart.NODE_TEXT_CLASS = 'node_text';
    _chart.LINK_CLASS = 'link';
    _chart.LINK_LINE_CLASS = 'stroked_line';

    var dataStruct, dataLength = 0, nodeGraphic, linkGraphic;

    _chart.transitionDuration(15);

    var _elasticRadius = false;
    _chart.elasticR = function (elasticRadius) {
        if (!arguments.length) {
            return _elasticRadius;
        }
        _elasticRadius = elasticRadius;
        return _chart;
    };

    var _elasticWidth = false;
    _chart.elasticWidth = function (elasticWidth) {
        if (!arguments.length) {
            return elasticWidth;
        }
        _elasticWidth = elasticWidth;
        return _chart;
    };

    var _renderImages = false;
    _chart.renderImages = function (renderImages) {
        if (!arguments.length) {
            return _renderImages;
        }
        _renderImages = renderImages;
        return _chart;
    };

    var _imageAccessor = function (d) {
        return d.image;
    };

    _chart.imageAccessor = function (imageAccessor) {
        if (!arguments.length) {
            return _imageAccessor;
        }
        _imageAccessor = imageAccessor;
        return _chart;
    };

    _chart.renderXAxis = function() {};
    _chart.renderYAxis = function() {};

    function getNodeIndex(nodesArray, node) {
      var result = -1;
      nodesArray.forEach(function(elem, i) {
        if (elem.key === node) {
          result = i;
        }
      });
      return result;
    }

    function getLinkIndex(linksArray, sourceIndex, targetIndex) {
      var result = -1;
      linksArray.forEach(function(elem, i) {
        if (elem.source === sourceIndex && elem.target === targetIndex) {
          result = i;
        }
      });
      return result;
    }

    function initData(rawData, dataStruct) {
      var rawNodes = rawData[0].value;
      var rawLinks = rawData[1].value;

      Object.keys(rawNodes).forEach(function(node) {
        var key = rawNodes[node].key;
        var count = rawNodes[node].count;
        var type = rawNodes[node].type;

        var newNode = {key:key, value:count, type:type};
        Object.keys(rawNodes[node]).forEach(function(additionalData) {
          if (additionalData !== 'key' && additionalData !== 'count' && additionalData !== 'type') {
            newNode[additionalData] = rawNodes[node][additionalData];
          }
        });

        if (getNodeIndex(dataStruct.nodes, newNode.key) < 0) {
          dataStruct.nodes.push(newNode);
        } else {
          console.log('duplicate: ' + newNode.key);
        }
      });

      Object.keys(rawLinks).forEach(function(linkKey) {
        var link = rawLinks[linkKey];
        var sourceIndex = getNodeIndex(dataStruct.nodes, link.source);
        var targetIndex = getNodeIndex(dataStruct.nodes, link.target);

        if (getLinkIndex(dataStruct.links, sourceIndex, targetIndex) < 0) {
          dataStruct.links.push({id: dataStruct.links.length, source: sourceIndex, target: targetIndex, types:link.types ,value:1});
        }
      });

      return dataStruct;
    }

    function transformData(rawData, dataStruct) {
      var rawNodes = rawData[0].value;

      dataStruct.nodes.forEach(function(d, i) {
        if (rawNodes[d.key] !== undefined) {
          dataStruct.nodes[i].value = rawNodes[d.key].count;
          dataStruct.nodes[i].weight = rawNodes[d.key].count;
        } else {
          dataStruct.nodes[i].value = 0;
          dataStruct.nodes[i].weight = 0;
        }
      });

      dataStruct.links.forEach(function(link) {
        var source = link.source;
        var target = link.target;

        link.value = 0;
        if (source.value > 0 && target.value > 0) {
          link.value = Math.min(source.value, target.value);
        }
      });

      return dataStruct;
    }

    _chart.plotData = function () {
      _chart.forceLayout().size(
        [_chart.width()-_chart.margins().left-_chart.margins().right,
         _chart.height()-_chart.margins().top-_chart.margins().bottom]);

      var data = _chart.data();
      if (data[0] !== undefined && Object.keys(data[0].value).length !== 0) {
        var nodeG, linkG;

        _chart.forceLayout().stop();
        if (dataStruct === undefined) {
          dataStruct = {
            nodes: [],
            links: []
          };

          dataStruct = initData(data, dataStruct);

          linkG = _chart.chartBodyG().selectAll('g.'+_chart.LINK_CLASS);
          linkG = _chart.chartBodyG().append('g')
                                        .attr('class', _chart.LINK_CLASS);

          nodeG = _chart.chartBodyG().selectAll('g.'+_chart.GRAPH_NODE_CLASS);
          nodeG = _chart.chartBodyG().append('g')
                                       .attr('class', _chart.GRAPH_NODE_CLASS);
        } else if (dataLength < Object.keys(data[0].value).length) {
          dataStruct = initData(data, dataStruct);

          linkG = _chart.chartBodyG().selectAll('g.'+_chart.LINK_CLASS);
          nodeG = _chart.chartBodyG().selectAll('g.'+_chart.GRAPH_NODE_CLASS);
        } else {
          linkG = _chart.chartBodyG().selectAll('g.'+_chart.LINK_CLASS);
          nodeG = _chart.chartBodyG().selectAll('g.'+_chart.GRAPH_NODE_CLASS);
        }
        dataLength = Object.keys(data[0].value).length;

        _chart.data(dataStruct);

        _chart.forceLayout()
          .nodes(dataStruct.nodes)
          .links(dataStruct.links)
          .start();

        dataStruct = transformData(data, dataStruct);

        if (_elasticRadius) {
          _chart.nodeRadiusScale().domain([_chart.rMin(), _chart.rMax()]);
        }
        _chart.nodeRadiusScale().range([_chart.MIN_RADIUS, _chart.xAxisLength() * _chart.maxNodeRelativeSize()]);

        if (_elasticWidth) {
          _chart.linkWidthScale().domain([_chart.linkWidthScaleMin(), _chart.linkWidthScaleMax()]);
        }
        _chart.linkWidthScale().range([_chart.MIN_LINK_WIDTH, _chart.xAxisLength() * _chart.maxLinkRelativeSize()]);

        _chart.initConnectedNodes(dataStruct.nodes, dataStruct.links);

        renderLinks(linkG, dataStruct.links);
        renderNodes(nodeG, dataStruct.nodes);

        _chart.forceLayout().on('tick', function() {
          if (data[0] !== undefined && Object.keys(data[0].value).length !== 0) {
            updateLinks(linkG);
            updateNodes(nodeG);

            dataStruct.nodes.forEach(_chart.collide(dataStruct.nodes, 0.5));
          }
        });

        _chart.fadeDeselectedArea();
      }
    };

    function renderNodes (nodeG, data) {
      var nodeGroup = nodeG.selectAll('g')
        .data(data, function (d) {
          return d.key;
        });

      var nodeGenter = nodeGroup.enter().append('g')
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        });

      if (_chart.renderLabel()) {
        //Add the text
        nodeGenter
          .append('text')
          .attr('class', function (d, i) {
              return _chart.NODE_TEXT_CLASS + ' _' + i;
          })
          .text(function(d) {
            return _chart.labelAccessor()(d);
          })
          .attr('font-size', function(d) {
            d.textLength = this.getComputedTextLength();
            return '0.5em';
          })
          .attr('x', function() { return 0; })
          .attr('y', function() { return 0; })
          .attr('dx', function(d) {
            return -0.25 * d.textLength;
          })
          .attr('dy', function() {
            return 1 + 'em';
          });

        dc.transition(nodeGenter, _chart.transitionDuration())
          // .selectAll('text.' + _chart.NODE_TEXT_CLASS)
          .attr('opacity', function (d) {
            return (_chart.nodeR(d) > 0) ? 1 : 0;
          });
      }

      //Add the nodes
      nodeGraphic = nodeGenter
        .insert('rect', ':first-child')
        .attr('class', function (d, i) {
            return _chart.NODE_CLASS + ' _' + i;
        })
        .attr('x', function(d) { return - 0.25 * d.textLength - _chart.paddingX(); })
        .attr('y', function() { return 0 - _chart.paddingY(); })
        .attr('rx', function() { return 5; })
        .attr('ry', function() { return 5; })
        .attr('width', function(d) {
          return 0.5 * d.textLength + (2 * _chart.paddingX());
        })
        .attr('height', function() {
          return  _chart.fontHeight() + _chart.paddingY();
        })
        .attr('fill', _chart.getColor)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('r', 0);

      nodeGenter
        .call(_chart.forceLayout().drag)
        .on('click', _chart.onClick)
        .on('mouseover', function(node) {
          d3.select(this).style('cursor', 'pointer');
          _chart.highlightConnectedLinks(linkGraphic, node, true);
          _chart.highlightConnectedNodes(nodeGraphic, node, true);

          nodeGraphic.attr('stroke', '#000');
        })
        .on('mouseout', function(node) {
          d3.select(this).style('cursor', 'default');
          _chart.highlightConnectedLinks(linkGraphic, node, false);
          _chart.highlightConnectedNodes(nodeGraphic, node, false);

          nodeGraphic.attr('stroke', '#fff');
        });

      nodeGenter.append('title')
        .text(function (d) {
          return d.key;
        });

      nodeGroup.exit().remove();

      // if (_chart.renderImages()) {
      //   nodeG.selectAll('image')
      //   .data(data, function (d) {
      //     return d.key;
      //   })
      //   .enter().append('image')
      //     .attr('xlink:href', _chart.imageAccessor())
      //     .attr('x', function(d) { return d.x - 16; })
      //     .attr('y', function(d) { return d.y - 16; })
      //     .attr('width', 32)
      //     .attr('height', 32)
      //     .attr('opacity', function (d) {
      //         return (_chart.nodeR(d) > 0) ? 1 : 0;
      //     })
      //     .on('click', _chart.onClick);
      // }

      dc.transition(nodeGenter, _chart.transitionDuration())
        // .attr('r', function (d) {
        //   return _chart.nodeR(d);
        // })
        .attr('opacity', function (d) {
          return (_chart.nodeR(d) > 0) ? 1 : 0;
        });
    }

    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr('y'),
            dy = parseFloat(text.attr('dy')),
            tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
        words.forEach(function(word) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
          }
        });
      });
    }

    function updateNodes (nodeG) {
      dc.transition(nodeG, _chart.transitionDuration())
        .selectAll('g')
        .attr('transform', function(d) {
          return 'translate(' + _chart.clampX(d.x) + ',' + _chart.clampY(d.y) + ')';
        })
        .attr('opacity', function (d) {
          return (_chart.nodeR(d) > 0) ? 1 : 0;
        });
    }

    // function updateLabels (textG) {
    // }

    // function removeNodes (nodeG) {
    //   dc.transition(nodeG, _chart.transitionDuration())
    //     .selectAll('g').exit().remove();
    // }
    //
    // function removeLinks (linkG) {
    //   dc.transition(linkG, _chart.transitionDuration())
    //     .selectAll('g').exit().remove();
    // }

    function renderLinks (linkG, data) {
        var linkGroup = linkG
          .selectAll('line')
          .data(data, function (d) {
            return d.id;
          });

        var linkGenter = linkGroup.enter();

        linkGraphic = linkGenter.append('line')
          .attr('class', function (d, i) {
              return _chart.LINK_LINE_CLASS + ' _' + i;
          })
          .attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; })
          .attr('stroke', _chart.getLinkColor)
          .attr('stroke-width', 0);

        dc.transition(linkG, _chart.transitionDuration())
          .selectAll('line.' + _chart.LINK_LINE_CLASS)
          .attr('stroke-width', function (d) {
              return _chart.linkWidth(d);
          })
          .attr('opacity', function (d) {
              return (_chart.linkWidth(d) > 0) ? 0.6 : 0;
          });

        linkGroup.exit().remove();
    }

    function updateLinks (linkG) {
      dc.transition(linkG, _chart.transitionDuration())
        .selectAll('line.' + _chart.LINK_LINE_CLASS)
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; })
        .attr('stroke', _chart.getLinkColor)
        .attr('stroke-width', function (d) {
            return _chart.linkWidth(d);
        })
        .attr('opacity', function (d) {
            return (_chart.linkWidth(d) > 0) ? 0.6 : 0;
        });
    }

    _chart.fadeDeselectedArea = function() {
      if (_chart.hasFilter()) {
        _chart.selectAll('rect.' + _chart.NODE_CLASS).each(function(d) {
          if (_chart.isSelectedNode(d)) {
            _chart.highlightSelected(this);
          } else {
            _chart.fadeDeselected(this);
          }
        });
      } else {
        _chart.selectAll('rect.' + _chart.NODE_CLASS).each(function() {
          _chart.resetHighlight(this);
        });
      }
    };

    _chart.renderBrush = function() {
      // override default x axis brush from parent chart
    };

    _chart.redrawBrush = function() {
      // override default x axis brush from parent chart
      _chart.fadeDeselectedArea();
    };

    _chart.destroy = function() {
      _chart.forceLayout().stop();
      dc.deregisterChart(_chart);
    };

    return _chart.anchor(parent, chartGroup);
};
