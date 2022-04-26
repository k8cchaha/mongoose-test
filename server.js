const http = require("http");

const requestListener = (req, res) => {
  console.log(req.url);
  res.end();
};

const server = http.createServer(requestListener);
server.listen(3005);
