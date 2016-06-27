/*
	File that prepares the necessary data to be used by visualizations
*/

/**
 *  Function that load the data from database file
 *
 *  @param callback the callback that will be triggered after data retrieval
 *
 */
function loadData(callback) {
	var dsvParser = d3.dsv(";", "text/plain");		// as csv file is separated by ;
	dsvParser(DATA_FILE_PATH, function(error, data) {
	 console.log("Data loaded");

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

    // invokes the callback to manipulate the resulting data
    callback(error, data);
	});
}



/**
 *  function that filter data for streamgraph
 *  @param data to be filtered
 *
 *  @return data filtered by UF_PROPONENTE, ANO_ASSINATURA_CONVENIO and MES_ASSINATURA_CONVENIO
 */
function handleData(data) {
  
  var query = "SELECT UF_PROPONENTE AS uf, \
          ANO_ASSINATURA_CONVENIO AS ano, SUM(VL_CONTRAPARTIDA_TOTAL) AS total FROM ? \
          WHERE ANO_ASSINATURA_CONVENIO > 2008  AND ANO_ASSINATURA_CONVENIO < 2016\
          GROUP BY UF_PROPONENTE, ANO_ASSINATURA_CONVENIO \
          ORDER BY UF_PROPONENTE, ANO_ASSINATURA_CONVENIO";
  var records = alasql(query, [data]);

  // remove NaN values from collection
  records = records.filter(function(innerElement) {
    return !isNaN(innerElement.ano);
  });

  return records;
};
