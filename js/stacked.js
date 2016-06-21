var stackedVisualization = {};


stackedVisualization.init = function(container, width, height) {

	var data = [
		{key: "Group1", value: 37, date: "04/23/12"},
		{key: "Group2", value: 12, date: "04/23/12"},
		{key: "Group3", value: 46, date: "04/23/12"},
		{key: "Group1", value: 32, date: "04/24/12"},
		{key: "Group2", value: 19, date: "04/24/12"},
		{key: "Group3", value: 42, date: "04/24/12"},
		{key: "Group1", value: 45, date: "04/25/12"},
		{key: "Group2", value: 16, date: "04/25/12"},
		{key: "Group3", value: 44, date: "04/25/12"},
		{key: "Group1", value: 24, date: "04/26/12"},
		{key: "Group2", value: 52, date: "04/26/12"},
		{key: "Group3", value: 64, date: "04/26/12"}
	];

	var format = d3.time.format("%m/%d/%y");

  var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var z = d3.scale.category20c();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(d3.time.days);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var stack = d3.layout.stack()
      .offset("zero")
      .values(function(d) { return d.values; })
      .x(function(d) { return d.date; })
      .y(function(d) { return d.value; });

  var nest = d3.nest()
      .key(function(d) { return d.key; });

  var area = d3.svg.area()
      .interpolate("cardinal")
      .x(function(d) { return x(d.date); })
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

  var svg = d3.select(container).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data.forEach(function(d) {
    d.date = format.parse(d.date);
    d.value = +d.value;
  });

  var layers = stack(nest.entries(data));

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

  svg.selectAll(".layer")
      .data(layers)
    .enter().append("path")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d, i) { return z(i); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
};