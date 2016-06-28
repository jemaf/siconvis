/*
	This file contains all the necessary constants
*/


// Data file path
const DATA_FILE_PATH         = "res/data.csv";
const MAP_FILE_PATH          = "res/brazil_map.json";

// Containers constants
const RADAR_CONTAINER                    = "#radar";
const STACK_INVESTMENTS_TOTAL_CONTAINER        = "#stack-investments-total";
const STACK_INVESTMENTS_COUNTERPART_CONTAINER        = "#stack-investments-counterpart";
const STACK_INVESTMENTS_STATE_CONTAINER        = "#stack-investments-state";
const STACK_TOTAL_CITIES_CONTAINER       = "#stack-total-cities";
const STACK_TOTAL_PROGRAMS_CONTAINER     = "#stack-total-programs";

// Text constants
const TOTAL_CITIES_TEXT 				 = "#total-cities-label";
const TOTAL_PROGRAMS_TEXT 				 = "#total-programs-label";

//state's details text constants
const SEARCH_BUTTON						 = "#search";
const STATE_NAME_TEXT 					 = ".state-name";
const STATE_CAPITAL_TEXT 				 = "#state-capital";
const STATE_REGION_TEXT 				 = "#state-region";
const STATE_POPULATION_TEXT 			 = "#state-population";
const STATE_CITIES_TEXT        = "#state-cities";
const STATE_FLAG 						 = "#state-flag";



// states' general data
var STATES_DATA = {
    "BR": {name: "Brasil"              ,  capital: "Brasília"        , population: "202.768.562", cities: "5.570"},
    "AC": {name: "Acre"                ,  capital: "Rio Branco"      , region: "Norte", population: "803.513", cities: "22", id: 3},
    "AL": {name: "Alagoas"             ,  capital: "Maceió"          , region: "Nordeste", population: "3.340.932", cities: "102", id: 2},
    "AP": {name: "Amapá"               ,  capital: "Macapá"          , region: "Norte", population: "766.679", cities: "16", id: 3},
    "AM": {name: "Amazonas"            ,  capital: "Manaus"          , region: "Norte", population: "3.938.336", cities: "62", id: 3},
    "BA": {name: "Bahia"               ,  capital: "Salvador"        , region: "Nordeste", population: "15.203.934", cities: "417", id: 2},
    "CE": {name: "Ceará"               ,  capital: "Fortaleza"       , region: "Nordeste", population: "8.904.459", cities: "184", id: 2},
    "DF": {name: "Distrito Federal"    ,  capital: "Brasília"        , region: "Centro-Oeste", population: "2.914.830", cities: "1", id: 1},
    "ES": {name: "Espírito Santo"      ,  capital: "Vitória"         , region: "Sudeste", population: "3.929.911", cities: "78", id: 4},
    "GO": {name: "Goiás"               ,  capital: "Goiânia"         , region: "Centro-Oeste", population: "6.610.681", cities: "246", id: 1},
    "MA": {name: "Maranhão"            ,  capital: "São Luís"        , region: "Nordeste", population: "6.904.241", cities: "217", id: 2},
    "MT": {name: "Mato Grosso"         ,  capital: "Cuiabá"          , region: "Centro-Oeste", population: "3.265.486", cities: "141", id: 1},
    "MS": {name: "Mato Grosso do Sul"  ,  capital: "Campo Grande"    , region: "Centro-Oeste", population: "2.449.341", cities: "79", id: 1},
    "MG": {name: "Minas Gerais"        ,  capital: "Belo Horizonte"  , region: "Sudeste", population: "20.869.101", cities: "853", id: 4},
    "PA": {name: "Pará"                ,  capital: "Belém"           , region: "Norte", population: "8.175.113", cities: "144", id: 3},
    "PB": {name: "Paraíba"             ,  capital: "João Pessoa"     , region: "Nordeste", population: "3.972.202", cities: "223", id: 2},
    "PR": {name: "Paraná"              ,  capital: "Curitiba"        , region: "Sul", population: "11.163.018", cities: "399", id: 5},
    "PE": {name: "Pernambuco"          ,  capital: "Recife"          , region: "Nordeste", population: "9.345.173", cities: "185", id: 2},
    "PI": {name: "Piauí"               ,  capital: "Teresina"        , region: "Nordeste", population: "3.204.028", cities: "224", id: 2},
    "RJ": {name: "Rio de Janeiro"      ,  capital: "Rio de Janeiro"  , region: "Sudeste", population: "16.550.024", cities: "92", id: 4},
    "RN": {name: "Rio Grande do Norte" ,  capital: "Natal"           , region: "Nordeste", population: "3.442.175", cities: "167", id: 2},
    "RS": {name: "Rio Grande do Sul"   ,  capital: "Porto Alegre"    , region: "Sul", population: "11.247.972", cities: "497", id: 5},
    "RO": {name: "Rondônia"            ,  capital: "Porto Velho"     , region: "Norte", population: "1.768.204", cities: "52", id: 3},
    "RR": {name: "Roraima"             ,  capital: "Boa Vista"       , region: "Norte", population: "505.665", cities: "15", id: 3},
    "SC": {name: "Santa Catarina"      ,  capital: "Florianópolis"   , region: "Sul", population: "6.819.190", cities: "295", id: 5},
    "SP": {name: "São Paulo"           ,  capital: "São Paulo"       , region: "Sudeste", population: "44.396.484", cities: "645", id: 4},
    "SE": {name: "Sergipe"             ,  capital: "Aracaju"         , region: "Nordeste", population: "2.242.937", cities: "75", id: 2},
    "TO": {name: "Tocantins"           ,  capital: "Palmas"          , region: "Norte", population: "1.515.126", cities: "139", id: 3}
};

var COLORS = ["#FDB462", "#FDB462", "#FDB462", "#FDB462", "#8DA0CB", "#8DA0CB", "#8DA0CB", "#8DA0CB", "#8DA0CB", "#8DA0CB", "#8DA0CB", 
    "#8DA0CB", "#8DA0CB", "#66C2A5", "#66C2A5", "#66C2A5", "#66C2A5", "#66C2A5", "#66C2A5", "#66C2A5", "#E78AC3", "#E78AC3", "#E78AC3", 
    "#E78AC3", "#B3B3B3", "#B3B3B3", "#B3B3B3"];

var COLORS_REGION = ["#FDB462", "#8DA0CB", "#66C2A5", "#E78AC3", "#B3B3B3"];