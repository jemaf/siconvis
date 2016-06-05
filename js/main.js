const FILE_PATH = "res/data.csv";

var CONTAINER_STACK = "#container-stack";


/**
 *	function that filter data for streamgraph
 *	@param data to be filtered
 *
 *	@return data filtered by UF_PROPONENTE, ANO_ASSINATURA_CONVENIO and MES_ASSINATURA_CONVENIO
 */
var handleData = function(data) {
	
	var res = {};
	var query = "SELECT UF_PROPONENTE AS uf, MES_ASSINATURA_CONVENIO AS mes, \
					ANO_ASSINATURA_CONVENIO AS ano, SUM(VL_CONTRAPARTIDA_TOTAL) AS total FROM ? \
				 	GROUP BY UF_PROPONENTE, MES_ASSINATURA_CONVENIO, ANO_ASSINATURA_CONVENIO\
				 	ORDER BY UF_PROPONENTE, ANO_ASSINATURA_CONVENIO, MES_ASSINATURA_CONVENIO";
	res.records = alasql(query, [data]);

	query = "SELECT uf, ARRAY({mes: mes, ano: ano, total: total}) AS items FROM ? GROUP BY uf ORDER BY ano, mes";
	res.records = alasql(query, [res.records]);

	res.records.forEach(function(element) {
		// remove NaN values from collection
		element.items = element.items.filter(function(innerElement) {
			return !isNaN(innerElement.ano) && !isNaN(innerElement.mes);
		});

		var totalAno = 0;
		element.items.forEach(function(param){
			totalAno += param.total;
		});

		//convert date to JS format
		element.items = element.items.map(function(innerElement) {
			var dateFormat = d3.time.format("%Y %m");
			return {date: dateFormat.parse(innerElement.ano + " " + innerElement.mes), value: innerElement.total,
					yearValue: totalAno};
		});

		//sort each item array
		element.items.sort(function(a, b) {
          return a.date.getTime() - b.date.getTime();
        });

		//get first and last date
		if (!res.firstDate || res.firstDate > element.items[0].date.getTime())
			res.firstDate = element.items[0].date;

		if (!res.lastDate || res.lastDate.getTime() < element.items[element.items.length - 1].date.getTime())
			res.lastDate = element.items[element.items.length - 1].date;
	});

	// normalize date to include every date between first and last one
	res.records.forEach(function(element) {
		
		var totalAno = 0;
		element.items.forEach(function(param){
			totalAno += param.value;
		});

		var currentDate = new Date(res.firstDate.getTime());
		for (var i = 0; currentDate.getTime() <= res.lastDate.getTime(); i++) {
			if (!element.items[i] || element.items[i].date.getTime() != currentDate.getTime()) {
				element.items.splice(i, 0, {date: new Date(currentDate.getTime()), value: 0, yearValue: totalAno});
			}
			currentDate.setMonth(currentDate.getMonth() + 1);
		}
	});

	return res;
};


/**
 *	function that draws the visualization into the html page
 *	@param data the data that will showed up
 *	@param element id of the element that will render the visualization
 */
var draw = function(element, data) {
	var margin = {top: 20, right: 40, bottom: 30, left: 40};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

  	//var width = 960, //dimensions of the visualization
     //height = 500;

    //colorRange = ["#e69a61", "#9817ff", "#18c61a", "#33b4ff", "#c9167e", "#297853", "#d7011b", 
    //"#7456c7", "#7e6276", "#afb113", "#fd879c", "#fb78fa", "#24c373", "#45bbc5", "#766b21", "#abad93", 
    //"#c19ce3", "#fd8f11", "#2f56ff", "#307a11", "#b3483c", "#0d7396", "#94b665", "#9d4d91", "#b807c8", 
    //"#086cbf", "#a2abc5"];

    colorRange = ["#015eff", "#0cc402", "#aea7a5", "#ff15ae", "#d99f07", "#11a5fe", "#037e43", "#ba4455", 
    "#d10aff", "#9354a6", "#7b6d2b", "#08bbbb", "#95b42d", "#b54e04", "#ee74ff", "#2d7593", "#e19772", "#fa7fbe",
    "#aea0db", "#905e76", "#92b27a", "#03c262", "#878aff", "#4a7662", "#07b6e5", "#fe8504", "#9340e1"];
    

    strokecolor = colorRange[0];
    
    // initialize stack graphic
	var stack = d3.layout.stack().offset("silhouette");

	// convert data to d3 format
	d3Data = data.records.map(function(element) {
		var newItems = element.items.map(function(innerElement) {
			// convert to log scale
			if (innerElement.value > 0)	
				innerElement.value = Math.log(innerElement.value);

			return {x: innerElement.date, y: +innerElement.value};
		});

		newItems.sort(function(a, b) {
          return a.x.getTime() - b.x.getTime();
        });
		
		return newItems;
	});

	d3PercentageData = data.records.map(function(element) {
		var newItems = element.items.map(function(innerElement) {
			// convert to log scale
			if (innerElement.value > 0)	
				innerElement.value = Math.log(innerElement.value);

			if (innerElement.yearValue > 0)
				innerElement.yearValue = Math.log(innerElement.yearValue);
			
			return {x: innerElement.date, y: innerElement.value / innerElement.yearValue * 100};
		});

		newItems.sort(function(a, b) {
          return a.x.getTime() - b.x.getTime();
        });
		
		return newItems;
	});

	layers0 = stack(d3Data);
	layers1 = stack(d3PercentageData);

	var x = d3.time.scale()
		.domain([data.firstDate, data.lastDate])
    	.range([0, width]);

	var y = d3.scale.linear()
	    .domain([0, d3.max(layers0.concat(layers1), function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
	    .range([height, 0]);

	var z = d3.scale.ordinal()
    	.range(colorRange);

	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
    	.ticks(d3.time.years);

	var yAxis = d3.svg.axis()
    	.scale(y);

	var yAxisr = d3.svg.axis()
    	.scale(y);

	var color = d3.scale.linear()
	    .range(["#aad", "#556"]);

	var area = d3.svg.area()
	    .x(function(d) { return x(d.x); })
	    .y0(function(d) { return y(d.y0); })
	    .y1(function(d) { return y(d.y0 + d.y); });

	var svg = d3.select(element).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	   .append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

	svg.selectAll("path")
	    .data(layers0)
	  .enter().append("path")
	    .attr("d", area)
	    .style("fill", function(d, i) { return z(i); });

	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  	svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ", 0)")
      .call(yAxis.orient("right"));

  	svg.append("g")
      .attr("class", "y axis")
      .call(yAxis.orient("left"));

	function transition() {
		d3.selectAll("path")
		  .data(function() {
		    var d = layers1;
		    layers1 = layers0;
		    return layers0 = d;
		  })
		.transition()
		  .duration(2500)
		  .attr("d", area);
	}

	$("#toggle-stack").click(transition);
};

//////////////////////////////////////
////    PROCESSAMENTO DOS DADOS   ////
//////////////////////////////////////
var dsvParser = d3.dsv(";", "text/plain");		// as csv file is separated by ;
dsvParser(FILE_PATH, function(error, data) {
	
	if (error) 
		throw error;

	// parse values from csv to their correct types.
	data.forEach(function(row){
		row.ANO_CONVENIO 				= 	parseInt(row.ANO_CONVENIO);
		row.CD_IDENTIF_PROPONENTE 		= 	parseInt(row.CD_IDENTIF_PROPONENTE);
		row.CD_ORGAO_CONCEDENTE 		= 	parseInt(row.CD_ORGAO_CONCEDENTE);
		row.CD_ORGAO_SUPERIOR 			= 	parseInt(row.CD_ORGAO_SUPERIOR);
		row.ID_CONVENIO 				= 	parseInt(row.ID_CONVENIO);
		row.ID_PROP 					= 	parseInt(row.ID_PROP);
		row.ID_PROP_PROGRAMA 			= 	parseInt(row.ID_PROP_PROGRAMA);
		row.NR_CONVENIO 				= 	parseInt(row.NR_CONVENIO);
		row.VL_CONTRAPARTIDA_BENS_SERV 	= 	parseInt(row.VL_CONTRAPARTIDA_BENS_SERV);
		row.VL_CONTRAPARTIDA_FINANC 	= 	parseInt(row.VL_CONTRAPARTIDA_FINANC);
		row.VL_CONTRAPARTIDA_TOTAL 		= 	parseInt(row.VL_CONTRAPARTIDA_TOTAL);
		row.VL_DESEMBOLSADO 			= 	parseInt(row.VL_DESEMBOLSADO);
		row.VL_EMPENHADO 				= 	parseInt(row.VL_EMPENHADO);
		row.VL_GLOBAL 					= 	parseInt(row.VL_GLOBAL);
		row.VL_REPASSE 					= 	parseInt(row.VL_REPASSE);
		row.DT_ASSINATURA_CONVENIO		= 	parseInt(row.DT_ASSINATURA_CONVENIO);
		row.MES_ASSINATURA_CONVENIO 	= 	parseInt(row.MES_ASSINATURA_CONVENIO);
		row.ANO_ASSINATURA_CONVENIO 	= 	parseInt(row.ANO_ASSINATURA_CONVENIO);
		row.MES_PUBLICACAO_CONVENIO 	= 	parseInt(row.MES_PUBLICACAO_CONVENIO);
		row.ANO_PUBLICACAO_CONVENIO 	= 	parseInt(row.ANO_PUBLICACAO_CONVENIO);
	
	});	

	var filteredData = handleData(data);
	draw(CONTAINER_STACK, filteredData);
});
