
dc.forceDirectedGraph = function (parent, chartGroup) {
    var _chart = dc.graphMixin(dc.coordinateGridMixin({}));

    _chart._mandatoryAttributes(['dimension', 'group']);
    _chart.TEXT_CLASS = 'labels';
    _chart.NODE_TEXT_CLASS = 'node_text';
    _chart.LINK_CLASS = 'link';
    _chart.LINK_LINE_CLASS = 'stroked_line';

    var dataStruct;

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

    function getIndex(nodesArray, node) {
      var result = -1;
      nodesArray.forEach(function(elem, i) {
        if (elem.key === node) {
          result = i;
        }
      });
      return result;
    }

    function initData(rawData) {
      var rawNodes = rawData[0].value;
      var rawLinks = rawData[1].value;

      var newData = {
        nodes: [],
        links: []
      };

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

        newData.nodes.push(newNode);
      });

      Object.keys(rawLinks).forEach(function(linkKey) {
        var link = rawLinks[linkKey];
        var sourceIndex = getIndex(newData.nodes, link.source);
        var targetIndex = getIndex(newData.nodes, link.target);

        newData.links.push({id: newData.links.length, source: sourceIndex, target: targetIndex, types:link.types ,value:1});
      });

      return newData;
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
        var nodeG, textG, linkG;

        if (dataStruct === undefined) {
          dataStruct = initData(data);

          linkG = _chart.chartBodyG().selectAll('g.'+_chart.LINK_CLASS);
          linkG = _chart.chartBodyG().append('g')
                                        .attr('class', _chart.LINK_CLASS);

          nodeG = _chart.chartBodyG().selectAll('g.'+_chart.GRAPH_NODE_CLASS);
          nodeG = _chart.chartBodyG().append('g')
                                       .attr('class', _chart.GRAPH_NODE_CLASS);

          textG = _chart.chartBodyG().selectAll('g.'+_chart.TEXT_CLASS);
          textG = _chart.chartBodyG().append('g')
                                      .attr('class', _chart.TEXT_CLASS);
        } else {
          _chart.forceLayout().stop();
          dataStruct = transformData(data, dataStruct);

          linkG = _chart.chartBodyG().selectAll('g.'+_chart.LINK_CLASS);
          nodeG = _chart.chartBodyG().selectAll('g.'+_chart.GRAPH_NODE_CLASS);
          textG = _chart.chartBodyG().selectAll('g.'+_chart.TEXT_CLASS);
        }

        _chart.data(dataStruct);

        _chart.forceLayout()
          .nodes(dataStruct.nodes)
          .links(dataStruct.links)
          .start();

        if (_elasticRadius) {
          _chart.nodeRadiusScale().domain([_chart.rMin(), _chart.rMax()]);
        }
        _chart.nodeRadiusScale().range([_chart.MIN_RADIUS, _chart.xAxisLength() * _chart.maxNodeRelativeSize()]);

        if (_elasticWidth) {
          _chart.linkWidthScale().domain([_chart.linkWidthScaleMin(), _chart.linkWidthScaleMax()]);
        }
        _chart.linkWidthScale().range([_chart.MIN_LINK_WIDTH, _chart.xAxisLength() * _chart.maxLinkRelativeSize()]);

        renderLinks(linkG, dataStruct.links);
        renderNodes(nodeG, dataStruct.nodes);
        renderLabels(textG, dataStruct.nodes);

        _chart.forceLayout().on('tick', function() {
          updateLinks(linkG);
          updateNodes(nodeG);
          updateLabels(textG);
        });

        removeLinks(linkG);
        removeNodes(nodeG);
        removeLabels(textG);

        _chart.fadeDeselectedArea();
      }
    };

    function renderNodes (nodeG, data) {
      //Add the nodes
      var graphic = nodeG
        .selectAll('circle')
        .data(data, function (d) {
          return d.key;
        })
        .enter().append('circle')
        .attr('class', function (d, i) {
            return _chart.NODE_CLASS + ' _' + i;
        })
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .on('click', _chart.onClick)
        .attr('fill', _chart.getColor)
        .attr('r', 0);

      if (_chart.renderImages()) {
        nodeG.selectAll('image')
        .data(data, function (d) {
          return d.key;
        })
        .enter().append('image')
          .attr('xlink:href', _chart.imageAccessor())
          .attr('x', function(d) { return d.x - 16; })
          .attr('y', function(d) { return d.y - 16; })
          .attr('width', 32)
          .attr('height', 32)
          .attr('opacity', function (d) {
              return (_chart.nodeR(d) > 0) ? 1 : 0;
          })
          .on('click', _chart.onClick);
      }

      graphic.append('title')
        .text(function (d) {
            return d.key;
        });

      dc.transition(nodeG, _chart.transitionDuration())
        .selectAll('circle.' + _chart.NODE_CLASS)
        .attr('r', function (d) {
            return _chart.nodeR(d);
        })
        .attr('opacity', function (d) {
            return (_chart.nodeR(d) > 0) ? 1 : 0;
        });
    }

    function renderLabels (textG, data) {
      if (_chart.renderLabel()) {
        //Add the text
        textG
          .selectAll('text')
          .data(data, function (d) {
            return d.key;
          })
          .enter().append('text')
          .attr('class', function (d, i) {
              return _chart.NODE_TEXT_CLASS + ' _' + i;
          })
          .attr('x', function(d) { return d.x; })
          .attr('y', function(d) { return d.y; })
          .attr('dx', 12)
          .attr('dy', '.35em')
          .text(function(d) {
            return d.key;
          });

        dc.transition(textG, _chart.transitionDuration())
          .selectAll('text.' + _chart.NODE_TEXT_CLASS)
          .attr('opacity', function (d) {
              return (_chart.nodeR(d) > 0) ? 1 : 0;
          });
      }
    }

    function updateNodes (nodeG) {
      dc.transition(nodeG, _chart.transitionDuration())
        .selectAll('circle.' + _chart.NODE_CLASS)
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) { return d.y; })
        .attr('fill', _chart.getColor)
        .attr('r', function (d) {
            return _chart.nodeR(d);
        })
        .attr('opacity', function (d) {
            return (_chart.nodeR(d) > 0) ? 1 : 0;
        });

      if (_chart.renderImages()) {
        dc.transition(nodeG, _chart.transitionDuration())
          .selectAll('image')
          .attr('x', function(d) { return d.x - 16; })
          .attr('y', function(d) { return d.y - 16; })
          .attr('opacity', function (d) {
              return (_chart.nodeR(d) > 0) ? 1 : 0;
          });
      }
    }

    function updateLabels (textG) {
      if (_chart.renderLabel()) {
        dc.transition(textG, _chart.transitionDuration())
          .selectAll('text.' + _chart.NODE_TEXT_CLASS)
          .attr('x', function(d) {
            return d.x;
          })
          .attr('y', function(d) { return d.y; })
          .attr('opacity', function (d) {
            return (_chart.nodeR(d) > 0) ? 1 : 0;
          });
      }
    }

    function removeNodes (nodeG) {
        // nodeG.exit().remove();
    }

    function removeLabels (textG) {
        // nodeG.exit().remove();
    }

    function renderLinks (linkG, data) {
        linkG
          .selectAll('line')
          .data(data, function (d) {
            return d.id;
          })
          .enter().append('line')
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

    function removeLinks (linkG) {
        // linkG.exit().remove();
    }

    _chart.renderBrush = function() {
      // override default x axis brush from parent chart
    };

    _chart.redrawBrush = function() {
      // override default x axis brush from parent chart
      _chart.fadeDeselectedArea();
    };

    return _chart.anchor(parent, chartGroup);
};
