// static-server.js
var express = require("express"),
    app = express(),
    api = require("./api"),
    gcStaticURL = '../../../practica/public';

app.use(express.static(gcStaticURL));

app.use('/api', api);

app.use(function(poRequest, poResponse, pfNext) {
    poResponse.status(404).send('Sorry cant find that!');
});

var server = app.listen(process.env.PORT, function () {
    var host = server.address().address,
        port = server.address().port;
    
    console.log('Example app listening at http://%s:%s', host, port);
});