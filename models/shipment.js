const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  awb_no: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  pickup_date: String,
  from: String,
  to: String,
  status: String,
  delivery_date: String,
  delivery_time: String,
  recipient: String,
  reference_no: String
});

module.exports = mongoose.model("Shipment", shipmentSchema);