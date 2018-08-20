const EventEmitter = require("events").EventEmitter; //EventEmitter provides multiple properties like on and emit. on property is used to bind a function with the event and emit is used to fire an event.
const http = require("http");
const util = require("util");

/**
 * An EventEmitter to get a CEP details.
 * @param cep
 * @constructor
 */
function Address(cep) {

    EventEmitter.call(this);
    addressEmitter = this;

    const req = http.get(`http://api.postmon.com.br/v1/cep/${cep}`, res => {
        let body = "";
        if (res.statusCode !== 200 && cep !== 'favicon.ico') {
            req.abort();
            addressEmitter.emit("error", new Error(`Houve um erro ao tentar acessar o CEP "${cep}". (${http.STATUS_CODES[res.statusCode]})`));
        }

        res.on('data', chunk => {
            body += chunk; //gathering the chunk (can be a string or a buffer) to the body
            addressEmitter.emit("data", chunk); //emit the whole thing in a string
        });

        res.on('end', function() {
            if(res.statusCode === 200) {
                try {
                    let address = JSON.parse(body); //turn string data to an object
                    addressEmitter.emit("end", address); //emit the object *
                } catch (error) {
                    addressEmitter.emit("error", error);
                }
            }
        }).on("error", error => {
            addressEmitter.emit("error", error);
        });
    });
}

util.inherits(Address, EventEmitter);

module.exports = Address;

/*
console.log(address);
{ complemento: 'até 99/100',
  bairro: 'Botafogo',
  cidade: 'Rio de Janeiro',
  logradouro: 'Rua da Passagem',
  estado_info:
   { area_km2: '43.781,566',
     codigo_ibge: '33',
     nome: 'Rio de Janeiro' },
  cep: '22290030',
  cidade_info: { area_km2: '1200,179', codigo_ibge: '3304557' },
  estado: 'RJ' }
  
  
console.log(chunk);  
<Buffer 7b 22 63 6f 6d 70 6c 65 6d 65 6e 74 6f 22 3a 20 22 61 74 5c 75 30 30 65 39 20 39 39 2f 31 30 30 22 2c 20 22 62 61 69 72 72 6f 22 3a 20 22 42 6f 74 61 ... >
<Buffer 0a 20 20 20 20 3c 21 44 4f 43 54 59 50 45 20 48 54 4d 4c 20 50 55 42 4c 49 43 20 22 2d 2f 2f 49 45 54 46 2f 2f 44 54 44 20 48 54 4d 4c 20 32 2e 30 2f ... >
  

console.log(body);

  
  
  */

