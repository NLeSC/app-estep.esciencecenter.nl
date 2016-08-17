
dc.forceDirectedGraph = function (parent, chartGroup) {
    var _chart = dc.bubbleMixin(dc.coordinateGridMixin({}));
    _chart.LINK_CLASS = 'link';
    _chart.LINK_LINE_CLASS = 'stroked_line';

    // var simulation = d3.forceSimulation()
    //   .force("link", d3.forceLink().id(function(d) { return d.key; }))
    //   .force("charge", d3.forceManyBody())
    //   .force("center", d3.forceCenter(width / 2, height / 2));

    var force, dataStruct;

    _chart.transitionDuration(50);

    var _elasticRadius = false;
    _chart.elasticR = function (elasticRadius) {
        if (!arguments.length) {
            return _elasticRadius;
        }
        _elasticRadius = elasticRadius;
        return _chart;
    };

    _chart.rMin = function () {
        var min = d3.min(_chart.data().nodes, function (e) {
            return _chart.radiusValueAccessor()(e);
        });
        return min;
    };

    _chart.rMax = function () {
        var max = d3.max(_chart.data().nodes, function (e) {
            return _chart.radiusValueAccessor()(e);
        });
        return max;
    };

    var _elasticWidth = false;
    _chart.elasticW = function (elasticWidth) {
        if (!arguments.length) {
            return elasticWidth;
        }
        _elasticWidth = elasticWidth;
        return _chart;
    };

    var _w = d3.scale.linear().domain([0, 100]);

    var _wValueAccessor = function (d) {
        return d.w;
    };

    _chart.w = function (linkWidthScale) {
        if (!arguments.length) {
            return _w;
        }
        _w = linkWidthScale;
        return _chart;
    };

    _chart.linkValueAccessor = function (linkValueAccessor) {
        if (!arguments.length) {
            return _wValueAccessor;
        }
        _wValueAccessor = linkValueAccessor;
        return _chart;
    };

    _chart.wMin = function () {
        var min = d3.min(_chart.data().links, function (e) {
            return _chart.linkValueAccessor()(e);
        });
        return min;
    };

    _chart.wMax = function () {
        var max = d3.max(_chart.data().links, function (e) {
            return _chart.linkValueAccessor()(e);
        });
        return max;
    };

    _chart.linkW = function (d) {
        var value = _chart.linkValueAccessor()(d);
        var w = _chart.w()(value);
        if (isNaN(w) || value <= 0) {
            w = 0;
        }
        return w;
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
      }

      Object.keys(rawNodes).forEach(function(node) {
        var name = rawNodes[node].name;
        var count = rawNodes[node].count;
        var type = rawNodes[node].type;

        newData.nodes.push({key: name, value: count, type: type});
      });

      rawLinks.forEach(function(link) {
        var sourceIndex = getIndex(newData.nodes, link[0]);
        var targetIndex = getIndex(newData.nodes, link[1]);

        newData.links.push({id: newData.links.length, source: sourceIndex, target: targetIndex, value:1});
      });

      return newData;
    }

    function transformData(rawData, dataStruct) {
      var rawNodes = rawData[0].value;
      var rawLinks = rawData[1].value;

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
          link.value = 1;
        }
      });

      return dataStruct;
    }

    _chart.plotData = function () {
      force = d3.layout.force()
        .gravity(0.05)
        .distance(60)
        .charge(-60)
        .size([_chart.width(), _chart.height()]);

      var data = _chart.data();
      if (data[0] !== undefined && Object.keys(data[0].value).length !== 0) {
        var bubbleG, linkG;

        if (dataStruct === undefined) {
          dataStruct = initData(data);

          bubbleG = _chart.chartBodyG().selectAll('g.'+_chart.BUBBLE_NODE_CLASS);
          bubbleG = _chart.chartBodyG().append('g')
                                       .attr('class', _chart.BUBBLE_NODE_CLASS);

          linkG = _chart.chartBodyG().selectAll('g.'+_chart.LINK_CLASS);
          linkG = _chart.chartBodyG().append('g')
                                     .attr('class', _chart.LINK_CLASS);
        } else {
          force.stop();
          dataStruct = transformData(data, dataStruct);

          bubbleG = _chart.chartBodyG().selectAll('g.'+_chart.BUBBLE_NODE_CLASS)
          linkG = _chart.chartBodyG().selectAll('g.'+_chart.LINK_CLASS)
        }

        _chart.data(dataStruct);

        force
          .nodes(dataStruct.nodes)
          .links(dataStruct.links)
          .start();

        if (_elasticRadius) {
          _chart.r().domain([_chart.rMin(), _chart.rMax()]);
        }
        _chart.r().range([_chart.MIN_RADIUS, _chart.xAxisLength() * _chart.maxBubbleRelativeSize()]);

        renderLinks(linkG, dataStruct.links);
        renderNodes(bubbleG, dataStruct.nodes);

        force.on('tick', function() {
          updateLinks(linkG);
          updateNodes(bubbleG);
        });

        removeLinks(linkG);
        removeNodes(bubbleG);

        _chart.fadeDeselectedArea();
      }
    };

    function renderNodes (bubbleG, data) {
      bubbleG
        .selectAll('circle')
        .data(data, function (d) {
          return d.key;
        })
        .enter().append('circle')
        .attr('class', function (d, i) {
            return _chart.BUBBLE_CLASS + ' _' + i;
        })
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .on('click', _chart.onClick)
        .attr('fill', _chart.getColor)
        .attr('stroke', '#fff')
        .attr('stroke-width', '1.5px')
        .attr('r', 0);
      dc.transition(bubbleG, _chart.transitionDuration())
        .selectAll('circle.' + _chart.BUBBLE_CLASS)
        .attr('r', function (d) {
            return _chart.bubbleR(d);
        })
        .attr('opacity', function (d) {
            return (_chart.bubbleR(d) > 0) ? 1 : 0;
        });
    }

    function updateNodes (bubbleG) {
      dc.transition(bubbleG, _chart.transitionDuration())
        .selectAll('circle.' + _chart.BUBBLE_CLASS)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr('fill', _chart.getColor)
        .attr('stroke', '#fff')
        .attr('stroke-width', '1.5px')
        .attr('r', function (d) {
            return _chart.bubbleR(d);
        })
        .attr('opacity', function (d) {
            return (_chart.bubbleR(d) > 0) ? 1 : 0;
        });
    }

    function removeNodes (bubbleG) {
        // bubbleG.exit().remove();
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
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; })
          .attr('stroke', _chart.getColor)
          .attr('stroke-width', 0);
        dc.transition(linkG, _chart.transitionDuration())
            .selectAll('line.' + _chart.LINK_LINE_CLASS)
            .attr('stroke-width', function (d) {
                return _chart.linkW(d);
            })
            .attr('opacity', function (d) {
                return (_chart.linkW(d) > 0) ? 0.6 : 0;
            });

        // _chart._doRenderLinkLabel(bubbleGEnter);
        // _chart._doRenderLinkTitles(bubbleGEnter);
    }

    function updateLinks (linkG) {
      dc.transition(linkG, _chart.transitionDuration())
        .selectAll('line.' + _chart.LINK_LINE_CLASS)
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .attr('stroke', _chart.getColor)
        .attr('stroke-width', function (d) {
            return _chart.linkW(d);
        })
        .attr('opacity', function (d) {
            return (_chart.linkW(d) > 0) ? 0.6 : 0;
        });

        // _chart.doUpdateLinkLabels(linkG);
        // _chart.doUpdateLinkTitles(linkG);
    }

    function removeLinks (linkG) {
        // linkG.exit().remove();
    }

    _chart.renderBrush = function () {
        // override default x axis brush from parent chart
    };

    _chart.redrawBrush = function () {
        // override default x axis brush from parent chart
        _chart.fadeDeselectedArea();
    };

    return _chart.anchor(parent, chartGroup);
};
