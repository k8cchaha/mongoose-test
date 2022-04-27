const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: {
      type: Number,
      require: [true, "價格必填"],
    },
    rating: Number,
  },
  {
    versionKey: false,
  }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
