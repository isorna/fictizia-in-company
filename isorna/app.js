var compresor = require('./server/modules/compresor'),
    server = require("./server/server");

compresor.comprimir();

server.start();