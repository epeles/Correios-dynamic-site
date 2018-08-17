const Address = require('./correios');
const renderer = require('./renderer');
const querystring = require('querystring');

const home = (req,res) => { // req = instance of http.IncomingMessage (readable stream). res = instance of http.ServerResponse (writable stream). More info at https://medium.com/aprendendo-nodejs/obtendo-as-respostas-ca8245646c
    if (req.url === "/") { 
        if (req.method.toLowerCase() === 'get') { //GET method shows in the URL the input typed by the user, while POST hides it.
            res.writeHead(200, {'Content-Type': 'text/html'});
            renderer.view('header', {}, res);
            renderer.view('search', {}, res);
            renderer.view('footer', {}, res);
            res.end();
        }
        else { //if url == '/' and POST
            req.on('data', postBody => { //extract the 'text' typed by the user. In that case, it's an IncomingMessage object
                let query = querystring.parse(postBody.toString()); //since data is a buffer (or stream), it needs to be converted to a string in order to be readable. The querystring parses the querystring and returns an object (i.e.: 'cep=22290030' will return '22290030'). . More info at https://www.w3schools.com/nodejs/ref_querystring.asp
                //console.log(query); //{ cep: '22290030' }
                res.writeHead(303, {'Location': '/' + query.cep}); //redirect the page to the /'text' informed (i.e.: '/22290030'). More info at https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#3xx_Redirection  
                res.end();
            });
        }    
    }    
}

const endereco = (req, res) => {
    let cep = req.url.replace('/','');
    if (cep.length > 0) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        renderer.view('header', {}, res);
        let getAddress = new Address(cep); //access the correios.js (declared in the beginning of this file), read the HTTP API and extract the wanted values in each new variable
        getAddress.on('end', cepJSON => {
            let values = {
                cidade: cepJSON.cidade,
                estado: cepJSON.estado,
                bairro: cepJSON.bairro,
                logradouro: cepJSON.logradouro,
                area_cidade: cepJSON.cidade_info.area_km2,
                cep: cepJSON.cep
            }
            renderer.view('address', values, res);
            renderer.view('footer', {}, res);
            res.end();
        });
        getAddress.on('error', error => {
            renderer.view('error', {errorMessage: error.message}, res);
            renderer.view('search', {}, res);
            renderer.view('footer', {}, res);
            res.end();
        });
    }
}

module.exports.home = home;
module.exports.endereco = endereco; 