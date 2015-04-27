var http = require("http");

function startServer (pfEnrutar) {
  http.createServer(function(poRequest, poResponse) {
    console.log('peticion recibida', poRequest.url);
    
    pfEnrutar(poRequest, poResponse);
    
  }).listen(process.env.PORT, process.env.IP);
  
  console.log('server iniciado en', process.env.PORT, process.env.IP);
}

exports.start = startServer;