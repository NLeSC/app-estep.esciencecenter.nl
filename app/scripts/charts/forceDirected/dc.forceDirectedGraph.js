
dc.forceDirectedGraph = function (parent, chartGroup) {
    var _chart = dc.bubbleMixin(dc.coordinateGridMixin({}));

    _chart._mandatoryAttributes(['dimension', 'group']);
    _chart.TEXT_CLASS = 'labels';
    _chart.BUBBLE_TEXT_CLASS = 'node_text';
    _chart.LINK_CLASS = 'link';
    _chart.LINK_LINE_CLASS = 'stroked_line';

    // var simulation = d3.forceSimulation()
    //   .force('link', d3.forceLink().id(function(d) { return d.key; }))
    //   .force('charge', d3.forceManyBody())
    //   .force('center', d3.forceCenter(width / 2, height / 2));

    var dataStruct;

    _chart.transitionDuration(15);

    var _forceLayout = d3.layout.force()
      .gravity(0.05)
      .distance(60)
      .charge(-60)
      .size([400, 300]);

    _chart.forceLayout = function (forceLayout) {
        if (!arguments.length) {
            return _forceLayout;
        }
        _forceLayout = forceLayout;
        return _chart;
    };

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

    var _linkWidthScale = d3.scale.linear().domain([0, 100]);

    var _linkKeyAccessor = function (d) {
        return d.key;
    };

    var _linkValueAccessor = function (d) {
        return d.value;
    };

    _chart.linkWidthScale = function (linkWidthScale) {
        if (!arguments.length) {
            return _linkWidthScale;
        }
        _linkWidthScale = linkWidthScale;
        return _chart;
    };

    _chart.linkKeyAccessor = function (linkKeyAccessor) {
        if (!arguments.length) {
            return _linkKeyAccessor;
        }
        _linkKeyAccessor = linkKeyAccessor;
        return _chart;
    };

    _chart.linkValueAccessor = function (linkValueAccessor) {
        if (!arguments.length) {
            return _linkValueAccessor;
        }
        _linkValueAccessor = linkValueAccessor;
        return _chart;
    };

    _chart.linkWidthScaleMin = function () {
        var min = d3.min(_chart.data().links, function (e) {
            return _chart.linkValueAccessor()(e);
        });
        return min;
    };

    _chart.linkWidthScaleMax = function () {
        var max = d3.max(_chart.data().links, function (e) {
            return _chart.linkValueAccessor()(e);
        });
        return max;
    };

    _chart.linkWidth = function (d) {
        var value = _chart.linkValueAccessor()(d);
        var w = _chart.linkWidthScale()(value);
        if (isNaN(w) || value <= 0) {
            w = 0;
        }
        return w;
    };

    var _linkColors = d3.scale.category20c();

    /**
     * Retrieve current link color scale or set a new color scale. This methods accepts any function that
     * operates like a d3 scale.
     * @method colors
     * @instance
     * @see {@link http://github.com/mbostock/d3/wiki/Scales d3.scale}
     * @example
     * // alternate categorical scale
     * chart.linkColors(d3.scale.category20b());
     * // ordinal scale
     * chart.linkColors(d3.scale.ordinal().range(['red','green','blue']));
     * @param {d3.scale} [linkColors=d3.scale.category20c()]
     * @return {d3.scale}
     */
    _chart.linkColors = function (linkColors) {
      if (!arguments.length) {
          return _linkColors;
      }
      if (linkColors instanceof Array) {
          _linkColors = d3.scale.quantize().range(linkColors); // deprecated legacy support, note: this fails for ordinal domains
      } else {
          _linkColors = d3.functor(linkColors);
      }
      return _chart;
    };

    var _linkColorAccessor = function (d) {
      return _chart.linkKeyAccessor()(d);
    };

    /**
     * Set or get the link color accessor function. This function will be used to map a data point in a
     * crossfilter group to a color value on the color scale. The default function uses the link key
     * accessor.
     * @method linkColorAccessor
     * @instance
     * @example
     * // default index based color accessor
     * .linkColorAccessor(function (d, i){return i;})
     * // color accessor for a multi-value crossfilter reduction
     * .linkColorAccessor(function (d){return d.value.absGain;})
     * @param {Function} [linkColorAccessor]
     * @return {Function}
     */
    _chart.linkColorAccessor = function (linkColorAccessor) {
        if (!arguments.length) {
            return _linkColorAccessor;
        }
        _linkColorAccessor = linkColorAccessor;
        return _chart;
    };

    /**
     * Get the color for the datum d and counter i. This is used internally by the charts to retrieve the link color.
     * @method getLinkColor
     * @instance
     * @param {*} d
     * @param {Number} [i]
     * @return {String}
     */
    _chart.getLinkColor = function (d, i) {
        return _linkColors(_linkColorAccessor.call(this, d, i));
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

        newData.nodes.push({key: key, value: count, type: type});
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
      // var rawLinks = rawData[1].value;

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
      _forceLayout.size([_chart.width()-_chart.margins().left-_chart.margins().right, _chart.height()-_chart.margins().top-_chart.margins().bottom]);

      var data = _chart.data();
      if (data[0] !== undefined && Object.keys(data[0].value).length !== 0) {
        var bubbleG, textG, linkG;

        if (dataStruct === undefined) {
          dataStruct = initData(data);

          linkG = _chart.chartBodyG().selectAll('g.'+_chart.LINK_CLASS);
          linkG = _chart.chartBodyG().append('g')
                                        .attr('class', _chart.LINK_CLASS);

          bubbleG = _chart.chartBodyG().selectAll('g.'+_chart.BUBBLE_NODE_CLASS);
          bubbleG = _chart.chartBodyG().append('g')
                                       .attr('class', _chart.BUBBLE_NODE_CLASS);

          textG = _chart.chartBodyG().selectAll('g.'+_chart.TEXT_CLASS);
          textG = _chart.chartBodyG().append('g')
                                      .attr('class', _chart.TEXT_CLASS);
        } else {
          _forceLayout.stop();
          dataStruct = transformData(data, dataStruct);

          linkG = _chart.chartBodyG().selectAll('g.'+_chart.LINK_CLASS);
          bubbleG = _chart.chartBodyG().selectAll('g.'+_chart.BUBBLE_NODE_CLASS);
          textG = _chart.chartBodyG().selectAll('g.'+_chart.TEXT_CLASS);
        }

        _chart.data(dataStruct);

        _forceLayout
          .nodes(dataStruct.nodes)
          .links(dataStruct.links)
          .start();

        if (_elasticRadius) {
          _chart.r().domain([_chart.rMin(), _chart.rMax()]);
        }
        _chart.r().range([_chart.MIN_RADIUS, _chart.xAxisLength() * _chart.maxBubbleRelativeSize()]);

        renderLinks(linkG, dataStruct.links);
        renderNodes(bubbleG, dataStruct.nodes);
        renderLabels(textG, dataStruct.nodes);
        // renderTitles(textG, dataStruct.nodes);

        _forceLayout.on('tick', function() {
          updateLinks(linkG);
          updateNodes(bubbleG);
          updateLabels(textG);
          // updateTitles(textG);
        });

        removeLinks(linkG);
        removeNodes(bubbleG);
        // removeTitles(textG);
        removeLabels(textG);

        _chart.fadeDeselectedArea();
      }
    };

    function renderNodes (bubbleG, data) {
      //Add the nodes
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
        .attr('r', 0)
        .append('title')
          .text(function (d) {
              return d.key;
          });

      dc.transition(bubbleG, _chart.transitionDuration())
        .selectAll('circle.' + _chart.BUBBLE_CLASS)
        .attr('r', function (d) {
            return _chart.bubbleR(d);
        })
        .attr('opacity', function (d) {
            return (_chart.bubbleR(d) > 0) ? 1 : 0;
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
              return _chart.BUBBLE_TEXT_CLASS + ' _' + i;
          })
          .attr('x', function(d) { return d.x; })
          .attr('y', function(d) { return d.y; })
          .attr('dx', 12)
          .attr('dy', '.35em')
          .text(function(d) {
            return d.key;
          });

        dc.transition(textG, _chart.transitionDuration())
          .selectAll('text.' + _chart.BUBBLE_TEXT_CLASS)
          .attr('opacity', function (d) {
              return (_chart.bubbleR(d) > 0) ? 1 : 0;
          });
      }
    }

    function updateNodes (bubbleG) {
      dc.transition(bubbleG, _chart.transitionDuration())
        .selectAll('circle.' + _chart.BUBBLE_CLASS)
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) { return d.y; })
        .attr('fill', _chart.getColor)
        .attr('r', function (d) {
            return _chart.bubbleR(d);
        })
        .attr('opacity', function (d) {
            return (_chart.bubbleR(d) > 0) ? 1 : 0;
        });
    }

    function updateLabels (textG) {
      if (_chart.renderLabel()) {
        dc.transition(textG, _chart.transitionDuration())
          .selectAll('text.' + _chart.BUBBLE_TEXT_CLASS)
          .attr('x', function(d) {
            return d.x;
          })
          .attr('y', function(d) { return d.y; })
          .attr('opacity', function (d) {
            return (_chart.bubbleR(d) > 0) ? 1 : 0;
          });
      }
    }

    function removeNodes (bubbleG) {
        // bubbleG.exit().remove();
    }

    function removeLabels (textG) {
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

    _chart.isSelectedNode = function (d) {
        return _chart.hasFilter(d.key);
    };

    _chart.onClick = function (d) {
      var filter = d.key;
      dc.events.trigger(function () {
        _chart.filter(filter);
        _chart.redrawGroup();
      });
    };

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
