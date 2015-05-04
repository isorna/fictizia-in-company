var express = require("express"),
    router = express.Router();
/*
router.param('id', function (poRequest, poResponse, pfNext, pId) {
    if (pId !== '') {
        console.log('ID', pId);
        poRequest.id = pId;
        pfNext();
    } else {
        tellUserIdNotFound(poResponse);
    }
});*/
/*
router.get('/:id', function (poRequest, poResponse, pfNext) {
    poResponse.end('ID recibido: ' + poRequest.params.id + ' (' + poRequest.id + ')');
});*/
router.get('/:id', function (poRequest, poResponse) {
    var cId = poRequest.params.id;
    // obtener datos
    poResponse.end('ID recibido:' + cId);
});
router.post('/:nombre/:apellido', function (poRequest, poResponse) {
    var cNombre = poRequest.params.nombre,
        cApellido = poRequest.params.apellido;
    // guardar datos
    poResponse.end('datos recibidos:' + cNombre + ', ' + cApellido);
});
router.put('/:id', function (poRequest, poResponse) {
    var cId = poRequest.params.id;
    // actualizar
    poResponse.end('ID recibido:' + cId);
});
router.delete('/:id', function (poRequest, poResponse) {
    var cId = poRequest.params.id;
    // borrar
    poResponse.end('ID recibido:' + cId);
});

/*
router.get('/search', function (poRequest, poResponse) {
    var cFilename = 'search.html',
        oOptions = {
            root: __dirname + '/../client/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };
    
    poResponse.sendFile(cFilename, oOptions, function (poError) {
        if (poError) {
            console.log(poError);
            poResponse.status(poError.status).end();
        } else {
            console.log('Sent:', cFilename);
        }
    });
});

router.get('/new', function (poRequest, poResponse) {
    var cFilename = 'new.html',
        oOptions = {
            root: __dirname + '/../client/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };
    
    poResponse.sendFile(cFilename, oOptions, function (poError) {
        if (poError) {
            console.log(poError);
            poResponse.status(poError.status).end();
        } else {
            console.log('Sent:', cFilename);
        }
    });
});*/
    
module.exports = router;

function tellUserIdNotFound (poResponse) {
    poResponse.end('ID not found');
}

function validarNumerico () {
    
}