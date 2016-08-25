/**
 * This Mixin provides reusable functionalities for any chart that needs to visualize data using graphs.
 * @name graphMixin
 * @memberof dc
 * @mixin
 * @mixes dc.colorMixin
 * @param {Object} _chart
 * @return {dc.graphMixin}
 */
dc.graphMixin = function (_chart) {
  _chart = dc.colorMixin(_chart);

  var _maxNodeRelativeSize = 0.3;
  var _maxLinkRelativeSize = 0.3;

  _chart.GRAPH_NODE_CLASS = 'graphNode';
  _chart.NODE_CLASS = 'node';
  _chart.MIN_RADIUS = 10;
  _chart.MIN_LINK_WIDTH = 3;


  _chart.renderLabel(true);

  _chart.data(function (group) {
    return group.top(Infinity);
  });

  var _nodeRadiusScale = d3.scale.linear().domain([0, 100]);
  var _linkWidthScale = d3.scale.linear().domain([0, 100]);
  var _linkColors = d3.scale.category20c();
  var _forceLayout = d3.layout.force()
    .gravity(0.05)
    .distance(60)
    .charge(-60)
    .size([400, 300]);

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

  var _rValueAccessor = function (d) {
   return d.r;
  };

  /**
   * Get or set the node radius scale. By default the graph uses
   * {@link https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear d3.scale.linear().domain([0, 100])}
   * as its radius scale.
   * @method nodeRadiusScale
   * @memberof dc.graphMixin
   * @instance
   * @see {@link http://github.com/mbostock/d3/wiki/Scales d3.scale}
   * @param {d3.scale} [nodeRadiusScale=d3.scale.linear().domain([0, 100])]
   * @return {d3.scale}
   * @return {dc.graphMixin}
   */
   _chart.nodeRadiusScale = function (nodeRadiusScale) {
     if (!arguments.length) {
       return _nodeRadiusScale;
     }
     _nodeRadiusScale = nodeRadiusScale;
     return _chart;
   };

  /**
   * Get or set the radius value accessor function. If set, the radius value accessor function will
   * be used to retrieve a data value for each node. The data retrieved then will be mapped using
   * the r scale to the actual node radius. This allows you to encode a data dimension using node
   * size.
   * @method radiusValueAccessor
   * @memberof dc.graphMixin
   * @instance
   * @param {Function} [radiusValueAccessor]
   * @return {Function}
   * @return {dc.graphMixin}
   */
  _chart.radiusValueAccessor = function(radiusValueAccessor) {
    if (!arguments.length) {
      return _rValueAccessor;
    }
    _rValueAccessor = radiusValueAccessor;
    return _chart;
  };

  _chart.rMin = function() {
    var min = d3.min(_chart.data().nodes, function(e) {
      return _chart.radiusValueAccessor()(e);
    });
    return min;
  };

  _chart.rMax = function() {
    var max = d3.max(_chart.data().nodes, function(e) {
      return _chart.radiusValueAccessor()(e);
    });
    return max;
  };

  _chart.nodeR = function (d) {
    var value = _chart.radiusValueAccessor()(d);
    var r = _chart.nodeRadiusScale()(value);
    if (isNaN(r) || value <= 0) {
      r = 0;
    }
    return r;
  };

  /**
   * Get or set the minimum radius. This will be used to initialize the radius scale's range.
   * @method minRadius
   * @memberof dc.graphMixin
   * @instance
   * @param {Number} [radius=10]
   * @return {Number}
   * @return {dc.graphMixin}
   */
  _chart.minRadius = function (radius) {
    if (!arguments.length) {
      return _chart.MIN_RADIUS;
    }
    _chart.MIN_RADIUS = radius;
    return _chart;
  };

  /**
   * Get or set the maximum relative size of a node to the length of x axis. This value is useful
   * when the difference in radius between nodes is too great.
   * @method maxNodeRelativeSize
   * @memberof dc.graphMixin
   * @instance
   * @param {Number} [relativeSize=0.3]
   * @return {Number}
   * @return {dc.graphMixin}
   */
  _chart.maxNodeRelativeSize = function (relativeSize) {
    if (!arguments.length) {
      return _maxNodeRelativeSize;
    }
    _maxNodeRelativeSize = relativeSize;
    return _chart;
  };

  /**
   * Get or set the minimum link width. This will be used to initialize the link width scale's range.
   * @method minLinkWidth
   * @memberof dc.graphMixin
   * @instance
   * @param {Number} [radius=10]
   * @return {Number}
   * @return {dc.graphMixin}
   */
  _chart.minLinkWidth = function (width) {
    if (!arguments.length) {
      return _chart.MIN_LINK_WIDTH;
    }
    _chart.MIN_LINK_WIDTH = width;
    return _chart;
  };

  var _linkKeyAccessor = function(d) {
    return d.key;
  };

  var _linkValueAccessor = function(d) {
    return d.value;
  };

  _chart.linkWidthScale = function(linkWidthScale) {
    if (!arguments.length) {
      return _linkWidthScale;
    }
    _linkWidthScale = linkWidthScale;
    return _chart;
  };

  _chart.linkKeyAccessor = function(linkKeyAccessor) {
    if (!arguments.length) {
      return _linkKeyAccessor;
    }
    _linkKeyAccessor = linkKeyAccessor;
    return _chart;
  };

  _chart.linkValueAccessor = function(linkValueAccessor) {
    if (!arguments.length) {
      return _linkValueAccessor;
    }
    _linkValueAccessor = linkValueAccessor;
    return _chart;
  };

  _chart.linkWidthScaleMin = function() {
    var min = d3.min(_chart.data().links, function(e) {
      return _chart.linkValueAccessor()(e);
    });
    return min;
  };

  _chart.linkWidthScaleMax = function() {
    var max = d3.max(_chart.data().links, function(e) {
      return _chart.linkValueAccessor()(e);
    });
    return max;
  };

  _chart.linkWidth = function(d) {
    var value = _chart.linkValueAccessor()(d);
    var w = _chart.linkWidthScale()(value);
    if (isNaN(w) || value <= 0) {
      w = 0;
    }
    return w;
  };

  /**
   * Get or set the maximum relative size of a link's width to the length of x axis. This value is useful
   * when the difference in radius between nodes is too great.
   * @method maxLinkRelativeSize
   * @memberof dc.graphMixin
   * @instance
   * @param {Number} [relativeSize=0.3]
   * @return {Number}
   * @return {dc.graphMixin}
   */
  _chart.maxLinkRelativeSize = function (relativeSize) {
    if (!arguments.length) {
      return _maxLinkRelativeSize;
    }
    _maxLinkRelativeSize = relativeSize;
    return _chart;
  };

  _chart.forceLayout = function (forceLayout) {
    if (!arguments.length) {
      return _forceLayout;
    }
    _forceLayout = forceLayout;
    return _chart;
  };

  _chart.fadeDeselectedArea = function() {
    if (_chart.hasFilter()) {
      _chart.selectAll('circle.' + _chart.NODE_CLASS).each(function(d) {
        if (_chart.isSelectedNode(d)) {
          _chart.highlightSelected(this);
        } else {
          _chart.fadeDeselected(this);
        }
      });
    } else {
      _chart.selectAll('circle.' + _chart.NODE_CLASS).each(function() {
        _chart.resetHighlight(this);
      });
    }
  };

  _chart.isSelectedNode = function(d) {
    return _chart.hasFilter(d.key);
  };

  _chart.onClick = function(d) {
    var filter = d.key;
    dc.events.trigger(function() {
      _chart.filter(filter);
      _chart.redrawGroup();
    });
  };

  return _chart;
};
