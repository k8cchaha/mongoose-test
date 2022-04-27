const http = require("http");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/hotel")
  .then(() => {
    console.log("成功連線");
  })
  .catch((err) => {
    console.log(err);
  });

const roomSchema = {
  name: String,
  price: {
    type: Number,
    require: [true, "價格必填"],
  },
  rating: Number,
};

const Room = mongoose.model("Room", roomSchema);

const testRoom = new Room({
  name: "超級單人房",
  price: 3000,
  rating: 4.4,
});

testRoom
  .save()
  .then(() => {
    console.log("新增成功");
  })
  .catch((error) => {
    console.log(error);
  });

const requestListener = (req, res) => {
  console.log(req.url);
  res.end();
};

const server = http.createServer(requestListener);
server.listen(3005);
