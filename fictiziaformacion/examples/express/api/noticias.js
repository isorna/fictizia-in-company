var express = require("express"),
    router = express.Router();
    
router.get('/', function (poRequest, poResponse) {
    // obtener datos
    poResponse.end('SIN PARAMETROS');
});
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

module.exports = router;