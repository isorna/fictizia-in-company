var express = require("express"),
    rutas = express.Router();
    

rutas.get('/', function (poRequest, poResponse, pfNext) {
    poResponse.render('index', {});
});

rutas.get('/form', function (poRequest, poResponse, pfNext) {
    poResponse.render('form', {});
    //poRequest.params
});

module.exports = rutas;