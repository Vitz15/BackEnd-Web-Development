const express = require("express");
const users = require("./users");
const moment = require("moment");
const morgan = require("morgan");

const app = express();
const port = 3000;
const hostname = "127.0.0.1";

const log = (req, res, next) => {
  console.log(
    moment().format("h:mm:ss a") + " " + req.originalUrl + " " + req.ip
  );
  next();
};

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.status(200).json("This is the Home Page");
});

app.get("/users", (req, res) => {
  res.status(200).json({ users });
});
app.get("/users/:name", (req, res) => {
  const name = req.params.name.toLowerCase();
  const user = users.find((user) => user.name.toLowerCase() === name);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "Data users tidak ditemukan" });
  }
});

app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "resource tidak ditemukan",
  });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server",
  });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
