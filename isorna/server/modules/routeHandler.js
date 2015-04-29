var fs = require("fs"),
    qs = require("querystring"),
    Firebase = require("firebase"),
    gcPublicFolder = '../practica/public',
    gJSON_routes = {
        '/': function hadnle_index (poResponse, poRequest) {
            var oStream = {};
            
            poResponse.writeHead(200, {"Content-Type": 'text/html'});
            oStream = fs.createReadStream(gcPublicFolder + '/index.html');
            oStream.pipe(poResponse);
        },
        '/search/': function handle_search (poResponse, poRequest) {
            var oStream = {};
            
            if (poRequest.method === 'POST') {
                poRequest.body = '';
                poRequest.addListener('data', function (poChunk) {
                    poRequest.body = poRequest.body + poChunk;
                })
                .addListener('end', function () {
                    var oJSON = JSON.stringify(qs.parse(poRequest.body));
                    
                    console.log('POST request:', oJSON);
                    poResponse.end(oJSON);
                });
            } else {
                poResponse.writeHead(200, {"Content-Type": 'text/html'});
                oStream = fs.createReadStream(gcPublicFolder + '/search.html');
                oStream.pipe(poResponse);
            }
        },
        '/new/': function handle_new (poResponse, poRequest) {
            var cDB_URL = 'https://fictizia-node.firebaseio.com/personas',
                oDB_Referencia = new Firebase(cDB_URL),
                oStream = {};
            
            if (poRequest.method === 'POST') {
                poRequest.body = '';
                poRequest.addListener('data', function (poChunk) {
                    poRequest.body = poRequest.body + poChunk;
                })
                .addListener('end', function () {
                    var oJSON = qs.parse(poRequest.body),
                        cJSON = JSON.stringify(qs.parse(poRequest.body));
                    
                    oDB_Referencia.push(oJSON);
                    
                    console.log('POST request:', cJSON);
                    poResponse.end(cJSON);
                });
            } else {
                poResponse.writeHead(200, {"Content-Type": 'text/html'});
                oStream = fs.createReadStream(gcPublicFolder + '/new.html');
                oStream.pipe(poResponse);
            }
            
        }
    };
    
module.exports = gJSON_routes;