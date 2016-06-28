/*
  File that initializes and draws the stacked chart. 

  Based on the example provided at the link 
*/

function stackedChart() {
  var init = new Object();

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
        .key(function(d) { return d[init.nestKey()]; });

    var area = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) { return x(d.x); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });


    //remove previous visualization (if it exists)
    d3.select(init.container()).select("svg").remove();

    var svg = d3.select(init.container()).append("svg")
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


  init.animate = function(data, duration) {
    // Scale the range of the data again 
    // x.domain(d3.extent(data, function(d) { return d.x; }));
    // y.domain([0, d3.max(data, function(d) { return d.y; })]);

    // Select the section we want to apply our changes to
    var svg = d3.select(container).transition();

    // Make the changes
    svg.select(".line")   // change the line
        .duration(duration)
        .attr("d", function(d) { return area(d.values); });
    svg.select(".x.axis") // change the x axis
        .duration(duration)
        .call(xAxis);
    svg.select(".y.axis") // change the y axis
        .duration(duration)
        .call(yAxis);
  };


  init.container = function(value) {
    if (!arguments.length) 
      return init._container;

    init._container = value;
    return init;
  };


  init.margin = function(value) {
    if (!arguments.length) 
      return init._margin;

    init._margin = value;
    return init;
  };


  init.width = function(value) {
    if (!arguments.length) 
      return init._width;

    init._width = value;
    return init;
  };


  init.height = function(value) {
    if (!arguments.length) 
      return init._height;

    init._height = value;
    return init;
  };


  init.data = function(value) {
    if (!arguments.length) 
      return init._data;

    init._data = value;
    return init;
  };


  init.color = function(value) {
    if (!arguments.length) 
      return init._color;

    init._color = value;
    return init;
  };


  init.xAxis = function(values) {
    if (!arguments.length) 
      return init._xAxis;

    var x = d3.time.scale().range([0, init.width()]);

    init._xAxis = d3.svg.axis()
        .scale(x);

    if (values.orientation != undefined) init._xAxis = init._xAxis.orient(values.orientation);
    if (values.ticks != undefined)       init._xAxis = init._xAxis.ticks(values.ticks);
    if (values.tickSize != undefined)    init._xAxis = init._xAxis.tickSize(values.tickSize);
      
    return init;  
  };


  init.yAxis = function(values) {
    if (!arguments.length) 
      return init._yAxis;

    var y = d3.scale.linear().range([init.height(), 0]);

    init._yAxis = d3.svg.axis()
        .scale(y);

    if (values.orientation != undefined) init._yAxis = init._yAxis.orient(values.orientation);
    if (values.ticks != undefined)       init._yAxis = init._yAxis.ticks(values.ticks);
    if (values.tickSize != undefined)    init._yAxis = init._yAxis.tickSize(values.tickSize);

    return init;
  };


  init.nestKey = function(value) {
    if (!arguments.length) 
      return init._nestKey;

    init._nestKey = value;
    return init;
  };

  return init;
}