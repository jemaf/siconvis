/*
	This file handles Brazil's map visualization.
*/
var mapVisualization = {};


mapVisualization.init = function() {
  var width = 384,
      height = 380,
      centered;

  var projection = d3.geo.mercator()
      .scale(450)
      .center([-55, -10])
    .translate([width / 2, height / 2 - 50]);

  var path = d3.geo.path()
      .projection(projection);

  var svg = d3.select(MAP_CONTAINER).append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .on("click", clicked);

  var g = svg.append("g");

  d3.json(MAP_FILE_PATH, function(error, file) {
    if (error) throw error;

    g.append("g")
        .attr("class", "states")
      .selectAll("path")
        .data(topojson.feature(file, file.objects.states).features)
      .enter().append("path")
        .attr("d", path)
        .on("click", clicked);
  });


  function clicked(d) {
    var x, y, k;

    if (d && centered !== d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 4;
      centered = d;
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
    }

    g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

    g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.0 / k + "px");
  };
};