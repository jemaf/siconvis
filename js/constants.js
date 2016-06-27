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



// states' general data
var STATES_DATA = {
    "BR": {name: "Brasil"              ,  capital: "Brasília"                          },
    "AC": {name: "Acre"                ,  capital: "Rio Branco"      , region: "Norte"},
    "AL": {name: "Alagoas"             ,  capital: "Maceió"          , region: "Nordeste"},
    "AP": {name: "Amapá"               ,  capital: "Macapá"          , region: "Norte"},
    "AM": {name: "Amazonas"            ,  capital: "Manaus"          , region: "Norte"},
    "BA": {name: "Bahia"               ,  capital: "Salvador"        , region: "Nordeste"},
    "CE": {name: "Ceará"               ,  capital: "Fortaleza"       , region: "Nordeste"},
    "DF": {name: "Distrito Federal"    ,  capital: "Brasília"        , region: "Centro-Oeste"},
    "ES": {name: "Espírito Santo"      ,  capital: "Vitória"         , region: "Sudeste"},
    "GO": {name: "Goiás"               ,  capital: "Goiânia"         , region: "Centro-Oeste"},
    "MA": {name: "Maranhão"            ,  capital: "São Luís"        , region: "Nordeste"},
    "MT": {name: "Mato Grosso"         ,  capital: "Cuiabá"          , region: "Centro-Oeste"},
    "MS": {name: "Mato Grosso do Sul"  ,  capital: "Campo Grande"    , region: "Centro-Oeste"},
    "MG": {name: "Minas Gerais"        ,  capital: "Belo Horizonte"  , region: "Sudeste"},
    "PA": {name: "Pará"                ,  capital: "Belém"           , region: "Norte"},
    "PB": {name: "Paraíba"             ,  capital: "João Pessoa"     , region: "Nordeste"},
    "PR": {name: "Paraná"              ,  capital: "Curitiba"        , region: "Sul"},
    "PE": {name: "Pernambuco"          ,  capital: "Recife"          , region: "Nordeste"},
    "PI": {name: "Piauí"               ,  capital: "Teresina"        , region: "Nordeste"},
    "RJ": {name: "Rio de Janeiro"      ,  capital: "Rio de Janeiro"  , region: "Sudeste"},
    "RN": {name: "Rio Grande do Norte" ,  capital: "Natal"           , region: "Nordeste"},
    "RS": {name: "Rio Grande do Sul"   ,  capital: "Porto Alegre"    , region: "Sul"},
    "RO": {name: "Rondônia"            ,  capital: "Porto Velho"     , region: "Norte"},
    "RR": {name: "Roraima"             ,  capital: "Boa Vista"       , region: "Norte"},
    "SC": {name: "Santa Catarina"      ,  capital: "Florianópolis"   , region: "Sul"},
    "SP": {name: "São Paulo"           ,  capital: "São Paulo"       , region: "Sudeste"},
    "SE": {name: "Sergipe"             ,  capital: "Aracaju"         , region: "Nordeste"},
    "TO": {name: "Tocantins"           ,  capital: "Palmas"          , region: "Norte"}
};