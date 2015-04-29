// router.js
var url = require("url"),
    path = require("path"),
    fs = require("fs"),
    gcPublicFolder = '../practica/public',
    goMimeTypes = {
        "html": "text/html",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png",
        "js": "text/javascript",
        "css": "text/css"};

function enrutar (poRequest, poResponse, pfRouteHandler) {
    var cURL = poRequest.url,
        cPathname = url.parse(cURL).pathname,
        cExtension = path.extname(cPathname).replace('.', ''),
        cFileLocation = gcPublicFolder + cPathname,
        cStaticFileMimeType = goMimeTypes[cExtension];
    
    var cDebug = '';
    
    
    // asumo que es un .html
    if (cExtension === 'html') {
        cDebug += 'ES un HTML';
        
        // averiguar si el fichero existe
        fs.exists(cFileLocation, function (pbFileExists) {
            if (pbFileExists) {
                console.log('El fichero existe');
                serveStaticFile(poResponse, cFileLocation, cStaticFileMimeType);
            } else {
                console.log('El fichero NO existe');
                fileNotFound(poResponse, cFileLocation);
            }
            
        });
    } else if (cExtension === '') {
        cDebug += 'No tiene extension, peticion a logica de negocio';
        //cFileLocation += '.html';
        
        if (cPathname.charAt(cPathname.length - 1) !== '/') {
            cPathname += '/';
        }
        
        if (typeof pfRouteHandler[cPathname] === 'function') {
            pfRouteHandler[cPathname](poResponse, poRequest);
        } else {
            fileNotFound(poResponse, cFileLocation);
        }
        
        console.log('pathname', cPathname);
    }
}

exports.enrutar = enrutar;


function serveStaticFile (poResponse, pcStaticFileURL, pcStaticFileMimeType) {
    var oStream = {};
    
    poResponse.writeHead(200, {"Content-Type": pcStaticFileMimeType});
    oStream = fs.createReadStream(pcStaticFileURL);
    oStream.pipe(poResponse);
}

function fileNotFound (poResponse, pcStaticFileURL) {
    var oStream = {};
    
    poResponse.writeHead(404, {"Content-Type": "text/html"});
    oStream = fs.createReadStream(gcPublicFolder + '/404.html');
    oStream.pipe(poResponse);
    
    /*
    poResponse.writeHead(404, {"Content-Type": "text/plain"});
    poResponse.write("File not found: " + pcStaticFileURL);
    poResponse.end();*/
}