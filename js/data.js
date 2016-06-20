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
