var express = require("express"),
    router = express.Router(),
    noticias = require("./noticias");
    
router.use('/noticias', noticias);
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