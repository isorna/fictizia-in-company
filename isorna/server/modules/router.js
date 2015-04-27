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

function enrutar (poRequest, poResponse) {
    var cURL = poRequest.url,
        cPathname = url.parse(cURL).pathname,
        cExtension = path.extname(cPathname).replace('.', ''),
        cFileLocation = gcPublicFolder + cPathname;
    
    var cDebug = '';
    
    
    // asumo que es un .html
    if (cExtension === 'html') {
        cDebug += 'ES un HTML';
    } else if (cExtension === '') {
        cDebug += 'No tiene extension';
        cFileLocation += '.html';
    }
    
    // averiguar si el fichero existe
    fs.exists(cFileLocation, function (pbFileExists) {
        if (pbFileExists) {
            console.log('El fichero existe');
    
            poResponse.writeHead(200, {"Content-Type": "text/plain"});
            poResponse.write(cDebug);
            poResponse.end();
        } else {
            console.log('El fichero NO existe');
            fileNotFound(poResponse, cFileLocation);
        }
        
    });
    
}

exports.enrutar = enrutar;



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