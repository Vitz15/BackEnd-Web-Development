const express = require("express");
const users = require("./users");
const moment = require("moment");
const morgan = require("morgan");

const app = express();
const routers = require("./routers");
const port = 3000;
const path = require("path");
const cors = require("cors");
const hostname = "127.0.0.1";

const log = (req, res, next) => {
  console.log(
    moment().format("h:mm:ss a") + " " + req.originalUrl + " " + req.ip
  );
  next();
};

app.use(morgan("tiny"));
// app.use(errorhandler);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);
//Routing
app.use(routers);

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

app.put("/users/:name", (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;

  if (!newName) {
    return res
      .status(400)
      .json({ status: "error", message: "Data tidak boleh kosong" });
  }

  const user = users.find((user) => user.name === name);
  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User tidak ditemukan" });
  }

  user.name = newName;
  res.json({
    status: "success",
    message: "User berhasil diperbarui",
    data: user,
  });
});

// Endpoint Hapus User
app.delete("/users/:name", (req, res) => {
  const { name } = req.params;
  const index = users.findIndex((user) => user.name === name);

  if (index === -1) {
    return res
      .status(404)
      .json({ status: "error", message: "User tidak ditemukan" });
  }

  users.splice(index, 1);
  res.json({ status: "success", message: "User berhasil dihapus" });
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
