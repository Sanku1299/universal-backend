const connectDB = require("../database");
const Shipment = require("../models/shipment");

module.exports = async (req, res) => {
    await connectDB();
  try {

    const shipments = req.body;

    if (!Array.isArray(shipments)) {
      return res.status(400).json({
        message: "Invalid CSV data"
      });
    }

    const cleanedData = shipments.filter(row => row.awb_no);

    for (const row of cleanedData) {

      await Shipment.updateOne(
        { awb_no: row.awb_no },
        { $set: row },
        { upsert: true }
      );

    }

    res.json({
      message: "CSV processed successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Database error",
      error: err.message
    });

  }

};