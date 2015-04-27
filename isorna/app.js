var generador = require('./server/modules/generador'),
    server = require("./server/server"),
    router = require("./server/modules/router");

generador.generar('../practica/public');

server.start(router.enrutar);