var express = require("express"),
    bodyParser = require("body-parser"),
    rutas = express.Router(),
    urlencodedParser = bodyParser.urlencoded({ extended: false });
    

rutas.get('/', function (poRequest, poResponse) {
    poResponse.render('index', {});
});

rutas.get('/form', function (poRequest, poResponse) {
    poResponse.render('form', {});
    //poRequest.params
});

rutas.post('/form', urlencodedParser, function (poRequest, poResponse) {
    if (!poRequest.body) {
        return poResponse.sendStatus(400);
    }
    
    console.log(poRequest.body);
    
    poResponse.render('form', {
        nombre: poRequest.body.nombre,
        apellido: poRequest.body.apellido
    });
});

module.exports = rutas;