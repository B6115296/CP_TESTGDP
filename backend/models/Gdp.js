const mongoose = require("mongoose");

const GDPSchema = new mongoose.Schema({
  Province_ENG: {
    type: String,
    required: true,
    unique: true,
  },
  GDP2020: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("GDP", GDPSchema);