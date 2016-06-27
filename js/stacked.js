/*
  File that initializes and draws the stacked chart. 

  Based on the example provided at the link 
*/

function stackedChart() {

  function init() {
    return init
            .width(400)
            .height(200)
            .margin({top: 20, right: 30, bottom: 30, left: 40})
            .color(d3.scale.category20c())
            .xAxis({ orientation: "bottom", ticks: d3.time.days })
            .yAxis({ orientation: "left" })
            .nestKey("key");
  }


  init.draw = function() {
    var x = d3.time.scale()
        .range([0, init.width()]);

    var y = d3.scale.linear()
        .range([init.height(), 0]);

    var z = init.color();

    var stack = d3.layout.stack()
        .offset("zero")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    var nest = d3.nest()
        .key(function(d) { return d[nestKey]; });

    var area = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) { return x(d.x); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    var svg = d3.select(container).append("svg")
        .attr("width", init.width() + init.margin().left + init.margin().right)
        .attr("height", init.height() + init.margin().top + init.margin().bottom)
      .append("g")
        .attr("transform", "translate(" + init.margin().left + "," + init.margin().top + ")");

    var layers = stack(nest.entries(init.data()));

    x.domain(d3.extent(init.data(), function(d) { return d.x; }));
    y.domain([0, d3.max(init.data(), function(d) { return d.y0 + d.y; })]);

    svg.selectAll(".layer")
        .data(layers)
      .enter().append("path")
        .attr("class", "layer")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d, i) { return z(i); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + init.height() + ")")
        .call(init.xAxis());

    svg.append("g")
        .attr("class", "y axis")
        .call(init.yAxis());
  };


  init.container = function(value) {
    if (!arguments.length) 
      return container;

    container = value;
    return init;
  };


  init.margin = function(value) {
    if (!arguments.length) 
      return margin;

    margin = value;
    return init;
  };


  init.width = function(value) {
    if (!arguments.length) 
      return width;

    width = value;
    return init;
  };


  init.height = function(value) {
    if (!arguments.length) 
      return height;

    height = value;
    return init;
  };


  init.data = function(value) {
    if (!arguments.length) 
      return data;

    data = value;
    return init;
  };


  init.color = function(value) {
    if (!arguments.length) 
      return color;

    color = value;
    return init;
  };


  init.xAxis = function(values) {
    if (!arguments.length) 
      return xAxis;

    var x = d3.time.scale().range([0, init.width()]);

    xAxis = d3.svg.axis()
      .scale(x);

    if (values.orientation != undefined) xAxis = xAxis.orient(values.orientation);
    if (values.ticks != undefined)       xAxis = xAxis.ticks(values.ticks);
    if (values.tickSize != undefined)    xAxis = xAxis.tickSize(values.tickSize);
      
    return init;  
  };


  init.yAxis = function(values) {
    if (!arguments.length) 
      return yAxis;

    var y = d3.scale.linear().range([init.height(), 0]);

    yAxis = d3.svg.axis()
      .scale(y);

    if (values.orientation != undefined) yAxis = yAxis.orient(values.orientation);
    if (values.ticks != undefined)       yAxis = yAxis.ticks(values.ticks);
    if (values.tickSize != undefined)    yAxis = yAxis.tickSize(values.tickSize);

    return init;
  };


  init.nestKey = function(value) {
    if (!arguments.length) 
      return nestKey;

    nestKey = value;
    return init;
  };

  return init;
}