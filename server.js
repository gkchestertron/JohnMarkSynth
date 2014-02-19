var port = Number(process.env.PORT || 5000);
var http = require("http");
var path = require("path");
var mime = require("mime");
var router = require('./router.js').router;



var server = http.createServer(router);
var chatServer = require('./lib/synth_serve.js');
chatServer.createChat(server);

server.listen(port);
