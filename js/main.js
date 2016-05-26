const FILE_PATH = "res/data.csv";


/**
 *	function that filter data for streamgraph
 *	@param data to be filtered
 *
 *	@return data filtered by UF_PROPONENTE, ANO_ASSINATURA_CONVENIO and MES_ASSINATURA_CONVENIO
 */
var handleData = function(data) {

		var query = "SELECT UF_PROPONENTE AS uf, MES_ASSINATURA_CONVENIO AS mes, \
						ANO_ASSINATURA_CONVENIO AS ano, SUM(VL_CONTRAPARTIDA_TOTAL) AS total FROM ? \
					 	GROUP BY UF_PROPONENTE, MES_ASSINATURA_CONVENIO, ANO_ASSINATURA_CONVENIO\
					 	ORDER BY UF_PROPONENTE, ANO_ASSINATURA_CONVENIO, MES_ASSINATURA_CONVENIO";
		var res = alasql(query, [data]);

		query = "SELECT uf, ARRAY({mes: mes, ano: ano, total: total}) AS items FROM ? GROUP BY uf ORDER BY ano, mes";
		res = alasql(query, [res]);

		res = res.reduce(function(map, item) {
			map[item.uf] = item.items;			
			return map;
		}, {});

		return res;
};


/**
 *	function that draws the visualization into the html page
 *	@param data the data that will showed up
 *	@param element id of the element that will render the visualization
 */
var draw = function(data, element) {

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
	draw(filteredData, "#container");
});