var fs = require("fs");

exports.router = function (request, response) {
  if (request.url === "/") {
    fs.readFile('./public/index.html', "utf-8", function (err, data) {
      response.write(data);
      response.end();
    });
  } else {
    if (request.url.split(".")[1] === "js") {
      response.writeHead(200, {"Content-Type": "text/javascript"});
    } else if (request.url.split(".")[1] === "css") {
      response.writeHead(200, {"Content-Type": "text/css"});
    }
    fs.readFile('./public' + request.url, "utf-8", function (err, data) {
      if (data) {
        console.log(request.url);
        response.write(data);
        response.end();
      } else {
        response.writeHead(404);
      }
    });
  }

}