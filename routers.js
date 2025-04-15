const express = require("express");
const routers = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "public" });
const client = require("./mongodb");
const ObjectId = require("mongodb").ObjectId;

// Routing Upload
routers.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (file) {
    const target = path.join(__dirname, "public", file.originalname);
    fs.renameSync(file.path, target);
    res.send("file berhasil diupload");
  } else {
    res.send("file gagal");
  }
});

routers.get("/users", async (req, res) => {
  try {
    const db = client.db("latihan");
    const users = await db.collection("users").find().toArray();
    res.json({
      status: "success",
      message: "list users",
      data: users,
    });
  } catch (error) {
    res.json({
      status: "error",
    });
  }
});

// Get single user
routers.get("/users:id", async (req, res) => {
  try {
    const db = client.db("latihan");
    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).json({
      status: "success",
      message: "single User",
      data: user,
    });
  } catch (error) {
    res.json({
      status: "error",
    });
  }
});

// insert user
routers.post("/users", async (req, res) => {
  try {
    const db = client.db("latihan");
    const user = await db.collection("users").insertOne(req.body);
    res.status(200).json({
      status: "success",
      message: "Create User",
      data: user,
    });
  } catch (error) {
    res.json({
      status: "error",
    });
  }
});
// update user
routers.patch("/users/:id", async (req, res) => {
  try {
    const db = client.db("latihan");
    const user = await db.collection("users").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: req.body,
      }
    );

    if (user.modifiedCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Update User",
        data: user,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "User not found or no changes made",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update user",
    });
  }
});

// delete user
routers.delete("/users/:id", async (req, res) => {
  try {
    const db = client.db("latihan");
    const user = await db.collection("users").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).json({
      status: "success",
      message: "Delete User",
      data: user,
    });
  } catch (error) {
    res.json({
      status: "error",
    });
  }
});
// get order user (join/aggregate)
routers.get("/order/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID",
      });
    }

    const db = client.db("latihan");

    const orders = await db
      .collection("order")
      .aggregate([
        {
          $match: {
            UserId: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "UserId",
            foreignField: "_id",
            as: "user_info",
          },
        },
        {
          $unwind: "$user_info",
        },
        {
          $project: {
            _id: 1,
            product: 1,
            price: 1,
            "user_info._id": 1,
            "user_info.name": 1,
            "user_info.age": 1,
            "user_info.status": 1,
          },
        },
      ])
      .toArray();

    res.status(200).json({
      status: "success",
      message: "Get Order by User",
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to get order user",
    });
  }
});

module.exports = routers;
