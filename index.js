const http = require("http");
const users = require("./users");
const moment = require("moment");

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/json");
    res.write("This is the Home Page");
  } else if (url === "/about") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/json");
    res.write(
      JSON.stringify({
        Status: "success",
        Message: "response success",
        Description: "Exercise #02",
        Date: moment().format(),
      })
    );
  } else if (url === "/users") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/json");
    res.write(
      JSON.stringify({
        users,
      })
    );
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/json");
    res.write(
      JSON.stringify({
        Status: "not found",
        Message: "Route tidak ditemukan",
      })
    );
  }
  res.end();
});

const hostname = "127.0.0.1";
const port = 3000;
server.listen(port, hostname, () =>
  console.log(`Server running at http://${hostname}:${port}`)
);
