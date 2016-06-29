/*
  File that initializes and draws the stacked chart. 

  Based on the example provided at the link 
*/

function stackedChart() {
  var init = new Object();

  init.draw = function() {
    init._x = d3.time.scale()
        .range([0, init.width()]);

    init._y = d3.scale.linear()
        .range([init.height(), 0]);

    var z = init.color();

    var stack = d3.layout.stack()
        .offset("zero")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    var nest = d3.nest()
        .key(function(d) { return d[init.nestKey()]; });

    init._area = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) { return init._x(d.x); })
        .y0(function(d) { return init._y(d.y0); })
        .y1(function(d) { return init._y(d.y0 + d.y); });


    //remove previous visualization (if it exists)
    d3.select(init.container()).select("svg").remove();

    var svg = d3.select(init.container()).append("svg")
        .attr("width", init.width() + init.margin().left + init.margin().right)
        .attr("height", init.height() + init.margin().top + init.margin().bottom)
      .append("g")
        .attr("transform", "translate(" + init.margin().left + "," + init.margin().top + ")");

    var layers = stack(nest.entries(init.data()));

    var div = d3.select("body").append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 0);

    init._x.domain(d3.extent(init.data(), function(d) { return d.x; }));
    init._y.domain([0, d3.max(init.data(), function(d) { return d.y0 + d.y; })]);

    svg.selectAll(".layer")
        .data(layers)
      .enter().append("path")
        .attr("class", "layer")
        .attr("d", function(d) { return init._area(d.values); })
        .style("fill", function(d, i) { return z(i); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + init.height() + ")")
        .call(init.xAxis());

    svg.append("g")
        .attr("class", "y axis")
        .call(init.yAxis());

    if(init.hasTooltip()){
      svg.selectAll("path")
      .attr("opacity", 1)
      .on("mouseover", function(d, i) {
          svg.selectAll("path").transition()
              .duration(200)
              .attr("opacity", function(d, j) {
                return j != i ? 0.7 : 1;
            });
          div.transition()    
            .duration(200)    
            .style("opacity", .9);    
          div.html(d.key)  
            .style("left", (d3.event.pageX) + "px")   
            .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d, i) {
        svg.selectAll("path")
            .transition()
            .duration(500)
            .attr("opacity", "1");
          div.transition()    
            .duration(500)    
            .style("opacity", 0);
      });
    }
  };

  init.hasTooltip = function(value) {
    if (!arguments.length) 
      return hasTooltip;

    hasTooltip = value;
    return init;
  };


  init.toggleAnimation = function(duration) {

    if (init.alternativeData()) {
      var nest = d3.nest()
            .key(function(d) { return d[init.nestKey()]; });

      var stack = d3.layout.stack()   
        .offset("zero")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

      // swap values
      var d = init.alternativeData();
      init.alternativeData(init.data());
      init.data(d);
      
      // Scale the range of the data again 
      var layers = stack(nest.entries(init.data()));

      init._x.domain(d3.extent(init.data(), function(d) { return d.x; }));
      init._y.domain([0, d3.max(init.data(), function(d) { return d.y0 + d.y; })]);

      d3.select(init.container()).select("svg").selectAll(".layer")
        .data(layers)
        .transition()
          .duration(duration)
          .attr("d", function(d) { return init._area(d.values); });  
    }
    
  };

  init.alternativeData = function(value) {
    if (!arguments.length) 
      return init._alternativeData;

    init._alternativeData = value;
    return init;
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