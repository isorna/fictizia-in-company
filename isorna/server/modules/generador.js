var fs = require("fs"),
    path = require("path");

function generar (pcPath) {
    fs.readdir(pcPath, function (poError, paFiles) {
        if (poError) {
            throw poError;
        }
        
        var cData = 'CACHE MANIFEST';
        cData += '\n #' + new Date();
        
        paFiles.forEach(function escribirFichero (poFile) {
            cData += '\n' + poFile;
        })
        
        fs.writeFile(pcPath + '/manifest.appcache', cData);
    });
}

exports.generar = generar;