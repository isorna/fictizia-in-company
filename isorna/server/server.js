var http = require("http");

function startServer () {
  http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
  }).listen(process.env.PORT, process.env.IP);
  
  console.log('server iniciado en', process.env.PORT, process.env.IP);
}

exports.start = startServer;