var fs = require("fs"),
    path = require("path");


fs.readdir(process.argv[2], function (poError, paFiles) {
    if (poError) {
        throw poError;
    }
    
    var cData = 'CACHE MANIFEST';
    cData += '\n #' + new Date();
    
    paFiles.forEach(function escribirFichero (poFile) {
        cData += '\n' + poFile;
    })
    
    fs.writeFile('./manifest.appcache', cData);
});