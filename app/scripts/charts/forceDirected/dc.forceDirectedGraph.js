
dc.forceDirectedGraph = function (parent, chartGroup) {
    var _chart = dc.bubbleMixin(dc.coordinateGridMixin({}));
    _chart.LINK_CLASS = 'link';
    _chart.LINK_LINE_CLASS = 'stroked_line';

    // var simulation = d3.forceSimulation()
    //   .force("link", d3.forceLink().id(function(d) { return d.key; }))
    //   .force("charge", d3.forceManyBody())
    //   .force("center", d3.forceCenter(width / 2, height / 2));

    var force;

    _chart.transitionDuration(750);

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

    var bubbleLocator = function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
    };

    var lineLocator = function (d) {
        return 'translate(' + (bubbleX(d)) + ',' + (bubbleY(d)) + ')';
    };

    function getIndex(nodesArray, node) {
      var result = -1;
      nodesArray.forEach(function(elem, i) {
        if (elem.key === node) {
          result = i;
        }
      });
      return result;
    }

    function transformData(rawData) {
      var rawNodes = rawData[0].value;
      var rawProjects = rawData[1].value;
      var rawLinks = rawData[2].value;

      var newData = {
        nodes: [],
        links: []
      }

      rawNodes.forEach(function(node) {
        newData.nodes.push({key: node, value: 1});
      });

      Object.keys(rawProjects).forEach(function(project) {
        var name = rawProjects[project].name;
        var count = rawProjects[project].count;

        newData.nodes.push({key: name, value: count});
      });

      rawLinks.forEach(function(link) {
        var sourceIndex = getIndex(newData.nodes, link[0]);
        var targetIndex = getIndex(newData.nodes, link[1]);
        newData.links.push({source: sourceIndex, target: targetIndex, value:1});
      });

      return newData;
    }

    _chart.plotData = function () {
      force = d3.layout.force()
        .gravity(0.05)
        .distance(100)
        .charge(-100)
        .size([_chart.width(), _chart.height()]);

      var data = _chart.data();
      if (data[0] !== undefined) {
        data = transformData(data);
        _chart.data(data);

        force
          .nodes(data.nodes)
          .links(data.links)
          .start();

        // var bubbleG = _chart.chartBodyG().selectAll('g.' + _chart.BUBBLE_NODE_CLASS);
        //               // .data(data.nodes, function (d) { return d.key; });
        //
        // var linkG = _chart.chartBodyG().selectAll('g.' + _chart.LINK_CLASS);
        //               // .data(data.links, function (d) { return d; });
        //
        // var link = linkG.selectAll(".link")
        //   .data(data.links)
        //   .enter().append("line")
        //   .attr("class", "link");
        //
        // var node = bubbleG.selectAll(".node")
        //   .data(data.nodes)
        //   .enter().append("g")
        //   .attr("class", "node")
        //   .call(force.drag);
        //
        // force.on("tick", function() {
        //   link.attr("x1", function(d) { return d.source.x; })
        //   .attr("y1", function(d) { return d.source.y; })
        //   .attr("x2", function(d) { return d.target.x; })
        //   .attr("y2", function(d) { return d.target.y; });
        //
        //   node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        // });

        if (_elasticRadius) {
          _chart.r().domain([_chart.rMin(), _chart.rMax()]);
        }
        _chart.r().range([_chart.MIN_RADIUS, _chart.xAxisLength() * _chart.maxBubbleRelativeSize()]);

        var bubbleG = _chart.chartBodyG().selectAll('g.' + _chart.BUBBLE_NODE_CLASS)
                      .data(data.nodes, function (d) { return d.key; });

        renderNodes(bubbleG);
        updateNodes(bubbleG);
        removeNodes(bubbleG);

        var linkG = _chart.chartBodyG().selectAll('g.' + _chart.LINK_CLASS)
                      .data(data.links, function (d) { return d; });

        renderLinks(linkG);
        updateLinks(linkG);
        removeLinks(linkG);

        _chart.fadeDeselectedArea();
      } else {
        debugger
      }
    };

    function renderNodes (bubbleG) {
        var bubbleGEnter = bubbleG.enter().append('g');

        bubbleGEnter
            .attr('class', _chart.BUBBLE_NODE_CLASS)
            .attr('transform', bubbleLocator)
            .append('circle').attr('class', function (d, i) {
                return _chart.BUBBLE_CLASS + ' _' + i;
            })
            .on('click', _chart.onClick)
            .attr('fill', _chart.getColor)
            .attr('r', 0);
        dc.transition(bubbleG, _chart.transitionDuration())
            .selectAll('circle.' + _chart.BUBBLE_CLASS)
            .attr('r', function (d) {
                return _chart.bubbleR(d);
            })
            .attr('opacity', function (d) {
                return (_chart.bubbleR(d) > 0) ? 1 : 0;
            });

        _chart._doRenderLabel(bubbleGEnter);
        _chart._doRenderTitles(bubbleGEnter);
    }

    function updateNodes (bubbleG) {
        dc.transition(bubbleG, _chart.transitionDuration())
            .attr('transform', bubbleLocator)
            .selectAll('circle.' + _chart.BUBBLE_CLASS)
            .attr('fill', _chart.getColor)
            .attr('r', function (d) {
                return _chart.bubbleR(d);
            })
            .attr('opacity', function (d) {
                return (_chart.bubbleR(d) > 0) ? 1 : 0;
            });

        _chart.doUpdateLabels(bubbleG);
        _chart.doUpdateTitles(bubbleG);
    }

    function removeNodes (bubbleG) {
        bubbleG.exit().remove();
    }

    function renderLinks (linkG) {
        var linkGEnter = linkG.enter().append('g');

        linkGEnter
            .attr('class', _chart.LINK_CLASS)
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .append('line').attr('class', function (d, i) {
                return _chart.LINK_LINE_CLASS + ' _' + i;
            })
            .on('click', _chart.onClick)
            .attr('stroke', _chart.getColor)
            .attr('stroke-width', 0);
        dc.transition(linkG, _chart.transitionDuration())
            .selectAll('line.' + _chart.LINK_LINE_CLASS)
            .attr('stroke-width', function (d) {
                return _chart.linkW(d);
            })
            .attr('opacity', function (d) {
                return (_chart.linkW(d) > 0) ? 1 : 0;
            });

        // _chart._doRenderLinkLabel(bubbleGEnter);
        // _chart._doRenderLinkTitles(bubbleGEnter);
    }

    function updateLinks (linkG) {
        dc.transition(linkG, _chart.transitionDuration())
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .selectAll('line.' + _chart.LINK_LINE_CLASS)
            .attr('fill', _chart.getColor)
            .attr('stroke-width', function (d) {
                return _chart.linkW(d);
            })
            .attr('opacity', function (d) {
                return (_chart.linkW(d) > 0) ? 1 : 0;
            });

        // _chart.doUpdateLinkLabels(linkG);
        // _chart.doUpdateLinkTitles(linkG);
    }

    function removeLinks (linkG) {
        linkG.exit().remove();
    }

    function bubbleX (d) {
        var x = _chart.x()(_chart.keyAccessor()(d));
        if (isNaN(x)) {
            x = 0;
        }
        return x;
    }

    function bubbleY (d) {
        var y = _chart.y()(_chart.valueAccessor()(d));
        if (isNaN(y)) {
            y = 0;
        }
        return y;
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
