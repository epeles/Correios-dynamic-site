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
            body += chunk;
            addressEmitter.emit("data", chunk);
        });

        res.on('end', function () {
            if(res.statusCode === 200) {
                try {
                    let address = JSON.parse(body);
                    addressEmitter.emit("end", address);
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