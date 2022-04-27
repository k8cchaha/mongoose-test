const http = require("http");
const mongoose = require("mongoose");
const Room = require("./models/room");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  // .connect("mongodb://localhost:27017/hotel")
  .then(() => {
    console.log("成功連線");
  })
  .catch((err) => {
    console.log(err);
  });

const requestListener = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  if (req.url == "/rooms" && req.method == "GET") {
    const rooms = await Room.find();
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        rooms,
      })
    );
    res.end();
  } else if (req.url == "/rooms" && req.method == "POST") {
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const newRoom = await Room.create({
          name: data.name,
          price: data.price,
          rating: data.rating,
        });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            rooms: newRoom,
          })
        );
        res.end();
      } catch (error) {
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            message: "欄位有錯, 或沒有此ID",
            error,
          })
        );
        res.end();
      }
    });
  } else if (req.url == "/rooms" && req.method == "DELETE") {
    await Room.deleteMany({});
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        rooms: [],
      })
    );
    res.end();
  } else if (req.url.startsWith("/rooms/") && req.method == "DELETE") {
    const id = req.url.split("/").pop();
    const newRoom = await Room.findByIdAndDelete(id);
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: "success",
        rooms: newRoom,
      })
    );
    res.end();
  } else if (req.url.startsWith("/rooms/") && req.method == "PATCH") {
    req.on("end", async () => {
      try {
        const id = req.url.split("/").pop();
        const data = JSON.parse(body);
        const newRoom = await Room.findByIdAndUpdate(id, data);
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            rooms: newRoom,
          })
        );
        res.end();
      } catch (error) {}
    });
  } else if (req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此網站路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);
