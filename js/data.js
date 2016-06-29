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
      row.CD_PROGRAMA            = parseInt(row.CD_PROGRAMA);
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
  
  var query = "SELECT UF_PROPONENTE AS uf,\
          ANO_ASSINATURA_CONVENIO AS ano, SUM(VL_GLOBAL) AS total FROM ? \
          WHERE ANO_ASSINATURA_CONVENIO > 2008  AND ANO_ASSINATURA_CONVENIO < 2016\
          GROUP BY UF_PROPONENTE, ANO_ASSINATURA_CONVENIO \
          ORDER BY UF_PROPONENTE, ANO_ASSINATURA_CONVENIO";
  var records = alasql(query, [data]);

  // remove NaN values from collection
  records = records.filter(function(innerElement) {
    return !isNaN(innerElement.ano);
  });

  var unsortedMap = {"Centro-Oeste": [], "Nordeste": [], "Norte": [], "Sudeste": [], "Sul": []};
  var format = d3.time.format("%Y");
  records.forEach(function(d) {
    d.x = format.parse(d.ano + "");
    d.y = +d.total;
    d.region = STATES_DATA[d.uf].region;

    unsortedMap[d.region].push(d);
  });

  for(item in unsortedMap) {
    unsortedMap[item].sort(function(a, b) {
      return a.x - b.x;
    });
  }

  records = [].concat(unsortedMap["Centro-Oeste"])
              .concat(unsortedMap["Nordeste"])
              .concat(unsortedMap["Norte"])
              .concat(unsortedMap["Sudeste"])
              .concat(unsortedMap["Sul"]);
  
  // force deep copy to handle normalized values
  var normalizedRecords = JSON.parse(JSON.stringify(records));

  normalizedRecords.forEach(function(e) {
    var totalByYear = 0;
    unsortedMap[e.region].forEach(function(ie) {
      totalByYear += ie.total;
    });
    e.y = e.y / totalByYear;
    e.total = e.total / totalByYear;
    e.x = format.parse(e.ano + "");
  });

  return {"absolute": records, "normalized": normalizedRecords};
};

/**
 *  function that filter data for streamgraph
 *  @param data to be filtered
 *
 *  @return data filtered by UF_PROPONENTE, ANO_ASSINATURA_CONVENIO and MES_ASSINATURA_CONVENIO
 */
function getInvestmentStateData(data) {
  
  var query = "SELECT UF_PROPONENTE AS uf, \
          ANO_ASSINATURA_CONVENIO AS ano, SUM(VL_REPASSE) AS total FROM ? \
          WHERE ANO_ASSINATURA_CONVENIO > 2008  AND ANO_ASSINATURA_CONVENIO < 2016\
          GROUP BY UF_PROPONENTE, ANO_ASSINATURA_CONVENIO \
          ORDER BY UF_PROPONENTE, ANO_ASSINATURA_CONVENIO";
  var records = alasql(query, [data]);

  records = records.filter(function(innerElement) {
    return !isNaN(innerElement.ano);
  });

  var unsortedMap = {"Centro-Oeste": [], "Nordeste": [], "Norte": [], "Sudeste": [], "Sul": []};
  var format = d3.time.format("%Y");
  records.forEach(function(d) {
    d.x = format.parse(d.ano + "");
    d.y = +d.total;
    d.region = STATES_DATA[d.uf].region;
    
    unsortedMap[d.region].push(d);
  });

  for(item in unsortedMap) {
    unsortedMap[item].sort(function(a, b) {
      return a.x - b.x;
    });
  }

  records = [].concat(unsortedMap["Centro-Oeste"])
              .concat(unsortedMap["Nordeste"])
              .concat(unsortedMap["Norte"])
              .concat(unsortedMap["Sudeste"])
              .concat(unsortedMap["Sul"]);


  // force deep copy to handle normalized values
  var normalizedRecords = JSON.parse(JSON.stringify(records));

  normalizedRecords.forEach(function(e) {
    var totalByYear = 0;
    unsortedMap[e.region].forEach(function(ie) {
      totalByYear += ie.total;
    });
    e.y = e.y / totalByYear;
    e.total = e.total / totalByYear;
    e.x = format.parse(e.ano + "");
  });

  return {"absolute": records, "normalized": normalizedRecords};
};

/**
 *  function that filter data for streamgraph
 *  @param data to be filtered
 *
 *  @return data filtered by UF_PROPONENTE, ANO_ASSINATURA_CONVENIO and MES_ASSINATURA_CONVENIO
 */
function getInvestmentsCounterpartData(data) {
  
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

  var unsortedMap = {"Centro-Oeste": [], "Nordeste": [], "Norte": [], "Sudeste": [], "Sul": []};
  var format = d3.time.format("%Y");
  records.forEach(function(d) {
    d.x = format.parse(d.ano + "");
    d.y = +d.total;
    d.region = STATES_DATA[d.uf].region;
    
    unsortedMap[d.region].push(d);
  });

  for(item in unsortedMap) {
    unsortedMap[item].sort(function(a, b) {
      return a.x - b.x;
    });
  }

  records = [].concat(unsortedMap["Centro-Oeste"])
              .concat(unsortedMap["Nordeste"])
              .concat(unsortedMap["Norte"])
              .concat(unsortedMap["Sudeste"])
              .concat(unsortedMap["Sul"]);

  // force deep copy to handle normalized values
  var normalizedRecords = JSON.parse(JSON.stringify(records));

  normalizedRecords.forEach(function(e) {
    var totalByYear = 0;
    unsortedMap[e.region].forEach(function(ie) {
      totalByYear += ie.total;
    });
    e.y = e.y / totalByYear;
    e.total = e.total / totalByYear;
    e.x = format.parse(e.ano + "");
  });

  return {"absolute": records, "normalized": normalizedRecords};
};

function getCityData(data, state) {
  var records = {items: [], total: 0};

  var stateCondition = state ? " AND UF_PROPONENTE = '" + state + "'" : " ";
  var query = "SELECT \
          ANO_ASSINATURA_CONVENIO AS ano, COUNT(DISTINCT NM_MUNICIPIO_PROPONENTE) AS cities FROM ? \
          WHERE ANO_ASSINATURA_CONVENIO > 2008  AND ANO_ASSINATURA_CONVENIO < 2016" +
          stateCondition +
          " GROUP BY ANO_ASSINATURA_CONVENIO \
          ORDER BY ANO_ASSINATURA_CONVENIO";
  records.items = alasql(query, [data]);

  var queryTotalCities = "SELECT COUNT(DISTINCT NM_MUNICIPIO_PROPONENTE) AS total_cities FROM ? \
          WHERE ANO_ASSINATURA_CONVENIO > 2008 AND ANO_ASSINATURA_CONVENIO < 2016" + stateCondition;
  records.total = alasql(queryTotalCities, [data])[0].total_cities;

  // remove NaN values from collection
  records.items = records.items.filter(function(innerElement) {
    return !isNaN(innerElement.ano);
  });

  var format = d3.time.format("%Y");
  records.items.forEach(function(d) {
    d.x = format.parse(d.ano + "");
    d.y = +d.cities;
  });

  records.items.sort(function(a, b) {
    return a.x - b.x;
  });

  return records;
};

function getProgramData(data, state) {
  var records = {items: [], total: 0};
  
  var stateCondition = state ? " AND UF_PROPONENTE = '" + state + "'" : " ";
  var query = "SELECT \
          ANO_ASSINATURA_CONVENIO AS ano, COUNT(DISTINCT ID_CONVENIO) as assignments FROM ? \
          WHERE ANO_ASSINATURA_CONVENIO > 2008 AND ANO_ASSINATURA_CONVENIO < 2016" +
          stateCondition +
          " GROUP BY ANO_ASSINATURA_CONVENIO \
          ORDER BY ANO_ASSINATURA_CONVENIO";
  records.items = alasql(query, [data]);

  // remove NaN values from collection
  records.items = records.items.filter(function(innerElement) {
    return !isNaN(innerElement.ano);
  });

  query = "SELECT COUNT(DISTINCT ID_CONVENIO) assignments FROM ? \
          WHERE ANO_ASSINATURA_CONVENIO > 2008 AND ANO_ASSINATURA_CONVENIO < 2016" + stateCondition;
  records.total = alasql(query, [data])[0].assignments;

  var format = d3.time.format("%Y");
  records.items.forEach(function(d) {
    d.x = format.parse(d.ano + "");
    d.y = +d.assignments;
  });

  records.items.sort(function(a, b) {
    return a.x - b.x;
  });

  return records;
};


function getRadarData(data, state) {
  var records = {items: [], total: 0};

  // query for current selection
  var stateCondition = state ? " AND UF_PROPONENTE = '" + state + "'" : " ";
  var queryValues = "SELECT NM_ORGAO_CONCEDENTE AS axis,\
          SUM(VL_GLOBAL) AS total FROM ?\
          WHERE ANO_ASSINATURA_CONVENIO > 2008  AND ANO_ASSINATURA_CONVENIO < 2016" +
          stateCondition +
          " GROUP BY NM_ORGAO_CONCEDENTE \
          ORDER BY total DESC \
          LIMIT 8";
  var temp = alasql(queryValues, [data]);

  var total = 0;
  var orgaos = [];
  temp.forEach(function(v) {
    total += v.total;
    orgaos.push("'" + v.axis + "'");
  });
  temp.forEach(function(v) {
    v.value = v.total / total;
  });
  records.items.push(temp);

  var regions = state ? ["Brasil"] : ["Norte", "Nordeste", "Sul", "Sudeste"];

  // query for each region in case a state is selected
  var regionCondition = "NM_ORGAO_CONCEDENTE = " + orgaos.join(" OR NM_ORGAO_CONCEDENTE = ");
  regions.forEach(function(region) {

    var region = region != "Brasil" ? " AND TX_REGIAO_PROPONENTE = '" + region + "'" : "";
    var queryRegion = "SELECT NM_ORGAO_CONCEDENTE AS axis,\
            SUM(VL_GLOBAL) AS total FROM ?\
            WHERE ANO_ASSINATURA_CONVENIO > 2008 AND ANO_ASSINATURA_CONVENIO < 2016 \
             " + region + " AND (" +
            regionCondition + 
            ") GROUP BY NM_ORGAO_CONCEDENTE \
            ORDER BY total DESC";
    temp = alasql(queryRegion, [data]);

    var total = 0;
    temp.forEach(function(v) {
      total += v.total;
    });
    temp.forEach(function(v) {
      v.value = v.total / total;
    });

    records.items.splice(0, 0, temp);
  });

  return records;
};

