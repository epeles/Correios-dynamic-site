const router = require('./router');
const http = require('http');

http.createServer((req,res) => {
 //   router.css(req,res);
    router.home(req,res);
    router.cep(req,res);
}).listen(3030);
console.log('Server is up. Have fun!');
