const connectDB = require("../database");
const Shipment = require("../models/shipment");

module.exports = async (req, res) => {
  await connectDB();
  const awb = req.params.awb;

  const shipment = await Shipment.findOne({ awb_no: awb });

  if (!shipment) {
    return res.json({ message: "AWB not found" });
  }

  res.json({
    awb: shipment.awb_no,
    pickup_date: shipment.pickup_date,
    from: shipment.from,
    to: shipment.to,
    status: shipment.status,
    delivery_date: shipment.delivery_date,
    delivery_time: shipment.delivery_time,
    recipient: shipment.recipient,
    reference_no: shipment.reference_no
  });

};