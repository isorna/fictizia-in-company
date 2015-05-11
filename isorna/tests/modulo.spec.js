var oCustomMatchers = {
        toBeOneLessThan: function (util, customEqualityTesters) {
            return {
                compare: function (poActual, poExpected) {
                    var result = {};
                    
                    result.pass = util.equals(poActual, poExpected - 1, customEqualityTesters);
                    
                    if (result.pass) {
                        result.message = poActual + ' is 1 less than ' + poExpected;
                    } else {
                        result.message = poActual + ' is not 1 less than ' + poExpected;
                    }
                    
                    return result;
                }
            };
        }
};

describe('Probar que el testeo funciona', function () {
    var oInstancia;
    
    beforeEach(function () {
        oInstancia = new MiClase('Alvaro', '38');
        //console.log(MiClase2);
        
        jasmine.addMatchers(oCustomMatchers);
    });
    
    afterEach(function () {
        oInstancia = null;
    });
    
    it('El nombre es "Alvaro"', function () {
        expect(oInstancia.nombre).toBe('Alvaro');
    });
    
    
    it('La edad es 38', function () {
        expect(oInstancia.edad).toBe('38');
        expect(Number(oInstancia.edad)).toBeOneLessThan(39);
    });
});