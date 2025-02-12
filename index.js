const express = require("express");
const users = require("./users");
const moment = require("moment");

const app = express();
const port = 3000;
const hostname = "127.0.0.1";

app.get("/", (req, res) => {
  res.status(200).json("This is the Home Page");
});

app.get("/about", (req, res) => {
  res.status(200).json({
    Status: "success",
    Message: "response success",
    Description: "Exercise #03",
    Date: moment().format(),
  });
});

app.get("/users", (req, res) => {
  res.status(200).json({ users });
});

app.use((req, res) => {
  res.status(404).json({
    Status: "not found",
    Message: "Route tidak ditemukan",
  });
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
