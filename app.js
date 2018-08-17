const router = require('./router');
const http = require('http');

http.createServer((req,res) => {
    router.home(req,res);
    router.endereco(req,res);
}).listen(3030);
console.log('Server is up. Have fun!');
