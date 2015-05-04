// static-server.js
var express = require("express"),
    app = express(),
    api = require("./api"),
    swig = require('swig'),
    rutas = require("./controllers/rutas"),
    gcStaticURL = '../../../practica/public';

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', './views');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({
    cache: false,
    locals: {
        appTitle: 'El titulo de mi app'
    }
});

app.use('/', rutas);
app.use('/api', api);

app.use(express.static(gcStaticURL));

app.use(function(poRequest, poResponse, pfNext) {
    poResponse.status(404).send('Sorry cant find that!');
});

var server = app.listen(process.env.PORT, function () {
    var host = server.address().address,
        port = server.address().port;
    
    console.log('Example app listening at http://%s:%s', host, port);
});