/*
  File that initializes and draws the radar chart.

  This visualization uses radar chart redesign,  developed by 
  Nadieh Bremer (http://bl.ocks.org/nbremer/21746a9668ffdf6d8242).
*/

function radarChart() {

  function init() {
    return init.width(600)
        .height(600)
        .margin({top: 20, right: 20, bottom: 20, left: 20})
        .levels(3)
        .maxValue(0)
        .labelFactor(1.25)
        .wrapWidth(60)
        .opacityArea(0.35)
        .dotRadius(4)
        .opacityCircles(0.1)
        .strokeWidth(2)
        .roundStrokes(false)
        .color(d3.scale.category10());
  }

	init.draw = function() {	
		//If the supplied maxValue is smaller than the actual one, replace by the max in the data
		var maxValue = Math.max(init.maxValue(), d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
			
		var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
			total = allAxis.length,					//The number of different axes
			radius = Math.min(init.width()/2, init.height()/2), 	//Radius of the outermost circle
			Format = d3.format('%'),			 	//Percentage formatting
			angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
		
		//Scale for the radius
		var rScale = d3.scale.linear()
			.range([0, radius])
			.domain([0, maxValue]);
			
		/////////////////////////////////////////////////////////
		//////////// Create the container SVG and g /////////////
		/////////////////////////////////////////////////////////

		//Remove whatever chart with the same id/class was present before
		d3.select(container).select("svg").remove();
		
		//Initiate the radar chart SVG
		var svg = d3.select(container).append("svg")
				.attr("width",  init.width() + init.margin().left + init.margin().right)
				.attr("height", init.height() + init.margin().top + init.margin().bottom)
				.attr("class", "radar"+container);
		//Append a g element		
		var g = svg.append("g")
				.attr("transform", "translate(" + (init.width()/2 + init.margin().left) + "," + (init.height()/2 + init.margin().top) + ")");
		
		/////////////////////////////////////////////////////////
		////////// Glow filter for some extra pizzazz ///////////
		/////////////////////////////////////////////////////////
		
		//Filter for the outside glow
		var filter = g.append('defs').append('filter').attr('id','glow'),
			feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
			feMerge = filter.append('feMerge'),
			feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
			feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

		/////////////////////////////////////////////////////////
		/////////////// Draw the Circular grid //////////////////
		/////////////////////////////////////////////////////////
		
		//Wrapper for the grid & axes
		var axisGrid = g.append("g").attr("class", "axisWrapper");
		
		//Draw the background circles
		axisGrid.selectAll(".levels")
		   .data(d3.range(1,(init.levels()+1)).reverse())
		   .enter()
			.append("circle")
			.attr("class", "gridCircle")
			.attr("r", function(d, i){return radius/init.levels()*d;})
			.style("fill", "#CDCDCD")
			.style("stroke", "#CDCDCD")
			.style("fill-opacity", init.opacityCircles())
			.style("filter" , "url(#glow)");

		//Text indicating at what % each level is
		axisGrid.selectAll(".axisLabel")
		   .data(d3.range(1,(init.levels()+1)).reverse())
		   .enter().append("text")
		   .attr("class", "axisLabel")
		   .attr("x", 4)
		   .attr("y", function(d){return -d*radius/init.levels();})
		   .attr("dy", "0.4em")
		   .style("font-size", "10px")
		   .attr("fill", "#737373")
		   .text(function(d,i) { return Format(maxValue * d/init.levels()); });

		/////////////////////////////////////////////////////////
		//////////////////// Draw the axes //////////////////////
		/////////////////////////////////////////////////////////
		
		//Create the straight lines radiating outward from the center
		var axis = axisGrid.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");
		//Append the lines
		axis.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
			.attr("class", "line")
			.style("stroke", "white")
			.style("stroke-width", "2px");

		//Append the labels at each axis
		axis.append("text")
			.attr("class", "legend")
			.style("font-size", "11px")
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.attr("x", function(d, i){ return rScale(maxValue * init.labelFactor()) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("y", function(d, i){ return rScale(maxValue * init.labelFactor()) * Math.sin(angleSlice*i - Math.PI/2); })
			.text(function(d){return d})
			.call(wrap, init.wrapWidth());

		/////////////////////////////////////////////////////////
		///////////// Draw the radar chart blobs ////////////////
		/////////////////////////////////////////////////////////
		
		//The radial line function
		var radarLine = d3.svg.line.radial()
			.interpolate("linear-closed")
			.radius(function(d) { return rScale(d.value); })
			.angle(function(d,i) {	return i*angleSlice; });
			
		if(init.roundStrokes()) {
			radarLine.interpolate("cardinal-closed");
		}
					
		//Create a wrapper for the blobs	
		var blobWrapper = g.selectAll(".radarWrapper")
			.data(data)
			.enter().append("g")
			.attr("class", "radarWrapper");
				
		//Append the backgrounds	
		blobWrapper
			.append("path")
			.attr("class", "radarArea")
			.attr("d", function(d,i) { return radarLine(d); })
			.style("fill", function(d,i) { return init.color()(i); })
			.style("fill-opacity", init.opacityArea())
			.on('mouseover', function (d,i){
				//Dim all blobs
				d3.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", 0.1); 
				//Bring back the hovered over blob
				d3.select(this)
					.transition().duration(200)
					.style("fill-opacity", 0.7);	
			})
			.on('mouseout', function(){
				//Bring back all blobs
				d3.selectAll(".radarArea")
					.transition().duration(200)
					.style("fill-opacity", init.opacityArea());
			});
			
		//Create the outlines	
		blobWrapper.append("path")
			.attr("class", "radarStroke")
			.attr("d", function(d,i) { return radarLine(d); })
			.style("stroke-width", init.strokeWidth() + "px")
			.style("stroke", function(d,i) { return init.color()(i); })
			.style("fill", "none")
			.style("filter" , "url(#glow)");		
		
		//Append the circles
		blobWrapper.selectAll(".radarCircle")
			.data(function(d,i) { return d; })
			.enter().append("circle")
			.attr("class", "radarCircle")
			.attr("r", init.dotRadius())
			.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
			.style("fill", function(d,i,j) { return init.color()(j); })
			.style("fill-opacity", 0.8);

		/////////////////////////////////////////////////////////
		//////// Append invisible circles for tooltip ///////////
		/////////////////////////////////////////////////////////
		
		//Wrapper for the invisible circles on top
		var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
			.data(data)
			.enter().append("g")
			.attr("class", "radarCircleWrapper");
			
		//Append a set of invisible circles on top for the mouseover pop-up
		blobCircleWrapper.selectAll(".radarInvisibleCircle")
			.data(function(d,i) { return d; })
			.enter().append("circle")
			.attr("class", "radarInvisibleCircle")
			.attr("r", init.dotRadius()*1.5)
			.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function(d,i) {
				newX =  parseFloat(d3.select(this).attr('cx')) - 10;
				newY =  parseFloat(d3.select(this).attr('cy')) - 10;
						
				tooltip
					.attr('x', newX)
					.attr('y', newY)
					.text(Format(d.value))
					.transition().duration(200)
					.style('opacity', 1);
			})
			.on("mouseout", function(){
				tooltip.transition().duration(200)
					.style("opacity", 0);
			});
			
		//Set up the small tooltip for when you hover over a circle
		var tooltip = g.append("text")
			.attr("class", "tooltip")
			.style("opacity", 0);
		
		/////////////////////////////////////////////////////////
		/////////////////// Helper Function /////////////////////
		/////////////////////////////////////////////////////////

		//Taken from http://bl.ocks.org/mbostock/7555321
		//Wraps SVG text	
		function wrap(text, width) {
		  text.each(function() {
	  		var text = d3.select(this),
	  			words = text.text().split(/\s+/).reverse(),
	  			word,
	  			line = [],
	  			lineNumber = 0,
	  			lineHeight = 1.4, // ems
	  			y = text.attr("y"),
	  			x = text.attr("x"),
	  			dy = parseFloat(text.attr("dy")),
	  			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
	  			
	  		while (word = words.pop()) {
	  		  line.push(word);
	  		  tspan.text(line.join(" "));
	  		  if (tspan.node().getComputedTextLength() > width) {
	  			line.pop();
	  			tspan.text(line.join(" "));
	  			line = [word];
	  			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  		  }
	  		}
		  });
		}//wrap	
	}


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


	init.maxValue = function(value) {
		if(!arguments.length)
			return maxValue;

		maxValue = value;
		return init;
	};


	init.levels = function(value) {
		if(!arguments.length)
			return levels;

		levels = value;
		return init;
	};


	init.roundStrokes = function(value) {
		if(!arguments.length)
			return roundStrokes;

		roundStrokes = value;
		return init;
	};


  init.labelFactor = function(value) {
    if(!arguments.length)
      return labelFactor;

    labelFactor = value;
    return init;
  };


  init.wrapWidth = function(value) {
    if(!arguments.length)
      return wrapWidth;

    wrapWidth = value;
    return init;
  };


  init.opacityArea = function(value) {
    if(!arguments.length)
      return opacityArea;

    opacityArea = value;
    return init;
  };  


  init.dotRadius = function(value) {
    if(!arguments.length)
      return dotRadius;

    dotRadius = value;
    return init;
  }; 


  init.opacityCircles = function(value) {
    if(!arguments.length)
      return opacityCircles;

    opacityCircles = value;
    return init;
  }; 


  init.strokeWidth = function(value) {
    if(!arguments.length)
      return strokeWidth;

    strokeWidth = value;
    return init;
  }; 

	return init;
}