/*await import("dotenv").then(dotenv => dotenv.config());
const { PORT, HOST } = process.env;
import http from 'http';
const server = http.createServer((request, response) => {
  const url = request.url;
  console.log(url);
  if (url == '/') response.end("Hello World!");
  else response.writeHead(404, { 'cotent-type': 'text/plain' })
    .end('not found');
});
server.listen(PORT, HOST, () => {
  console.log(`server started running at ${HOST}:${PORT}`);
});*/